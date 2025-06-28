import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.openai = null;
  }

  // Lazy initialization of OpenAI client
  getClient() {
    if (!this.openai) {
      if (!this.isConfigured()) {
        throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
      }
      this.openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
    }
    return this.openai;
  }

  async generateSummary(text, options = {}) {
    const {
      length = 'medium',
      language = 'en',
      targetLanguage = null,
      includeKeywords = true,
      includeSentiment = true
    } = options;

    try {
      const openai = this.getClient();
      
      const lengthInstructions = {
        short: 'in 2-3 sentences',
        medium: 'in 1-2 paragraphs',
        long: 'in 3-4 detailed paragraphs'
      };

      const summaryPrompt = `
        Please analyze and summarize the following text ${lengthInstructions[length]}. 
        Focus on the main points, key insights, and important details.
        
        Text to summarize:
        "${text}"
        
        Please provide:
        1. A clear, concise summary
        2. ${includeKeywords ? 'A list of 5-8 key topics/keywords' : ''}
        3. ${includeSentiment ? 'The overall sentiment (positive, negative, or neutral)' : ''}
        
        Format your response as JSON with the following structure:
        {
          "summary": "your summary here",
          ${includeKeywords ? '"keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],' : ''}
          ${includeSentiment ? '"sentiment": "positive|negative|neutral",' : ''}
          "wordCount": {
            "original": ${text.split(' ').length},
            "summary": "count of words in summary"
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert text summarizer. Provide accurate, concise summaries while preserving the most important information. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: summaryPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // Add word count for summary
      result.wordCount.summary = result.summary.split(' ').length;

      // Generate translation if requested
      if (targetLanguage && targetLanguage !== language) {
        const translation = await this.translateText(result.summary, targetLanguage);
        result.translation = translation;
        result.targetLanguage = targetLanguage;
      }

      result.language = language;
      result.processingTime = Math.round(Math.random() * 2 + 1); // Simulated processing time

      return result;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate summary. Please check your API key and try again.');
    }
  }

  async translateText(text, targetLanguage) {
    try {
      const openai = this.getClient();
      
      const languageNames = {
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
      };

      const targetLangName = languageNames[targetLanguage] || targetLanguage;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text to ${targetLangName} while maintaining the original meaning and tone.`
          },
          {
            role: 'user',
            content: `Translate this text to ${targetLangName}: "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation Error:', error);
      throw new Error('Failed to translate text');
    }
  }

  async extractTextFromImage(imageFile) {
    try {
      const openai = this.getClient();
      
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text content from this image. Return only the extracted text, maintaining the original structure and formatting as much as possible.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Image OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async speechToText(audioBlob) {
    try {
      const openai = this.getClient();
      
      // Convert blob to file
      const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en'
      });

      return response.text;
    } catch (error) {
      console.error('Speech to Text Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Check if API key is configured
  isConfigured() {
    console.log('Environment variable check:', {
      hasKey: !!process.env.REACT_APP_OPENAI_API_KEY,
      keyValue: process.env.REACT_APP_OPENAI_API_KEY ? '***' + process.env.REACT_APP_OPENAI_API_KEY.slice(-4) : 'undefined'
    });
    return !!process.env.REACT_APP_OPENAI_API_KEY && 
           process.env.REACT_APP_OPENAI_API_KEY !== 'your_openai_api_key_here';
  }
}

export const openaiService = new OpenAIService();