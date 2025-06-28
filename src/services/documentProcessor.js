import mammoth from 'mammoth';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { openaiService } from './openaiService';

class DocumentProcessor {
  constructor() {
    // Configure PDF.js worker
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }

  async processFile(file, options = {}) {
    const { summaryLength = 'medium', targetLanguage = null } = options;
    
    try {
      let extractedText = '';
      
      // Check if file has a valid type property
      if (!file || !file.type) {
        throw new Error('Invalid file: missing file type information');
      }
      
      // Extract text based on file type
      if (file.type === 'application/pdf') {
        extractedText = await this.extractFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await this.extractFromDOCX(file);
      } else if (file.type.startsWith('text/')) {
        extractedText = await this.extractFromText(file);
      } else if (file.type.startsWith('image/')) {
        extractedText = await this.extractFromImage(file);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file');
      }

      // Generate summary using OpenAI
      const result = await openaiService.generateSummary(extractedText, {
        length: summaryLength,
        targetLanguage,
        includeKeywords: true,
        includeSentiment: true
      });

      return {
        ...result,
        originalText: extractedText,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };

    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  }

  async extractFromPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      throw new Error('Failed to extract text from PDF: ' + error.message);
    }
  }

  async extractFromDOCX(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error('Failed to extract text from DOCX: ' + error.message);
    }
  }

  async extractFromText(file) {
    try {
      return await file.text();
    } catch (error) {
      throw new Error('Failed to read text file: ' + error.message);
    }
  }

  async extractFromImage(file) {
    try {
      if (!openaiService.isConfigured()) {
        throw new Error('OpenAI API key not configured for image processing');
      }
      
      return await openaiService.extractTextFromImage(file);
    } catch (error) {
      throw new Error('Failed to extract text from image: ' + error.message);
    }
  }

  // Process multiple files
  async processMultipleFiles(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.processFile(file, options);
        results.push({
          success: true,
          fileName: file.name,
          data: result
        });
      } catch (error) {
        results.push({
          success: false,
          fileName: file.name,
          error: error.message
        });
      }
    }

    return results;
  }

  // Combine multiple document summaries
  async combineDocumentSummaries(results, options = {}) {
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      throw new Error('No documents were successfully processed');
    }

    if (successfulResults.length === 1) {
      return successfulResults[0].data;
    }

    // Combine all summaries
    const combinedSummaries = successfulResults
      .map(r => `${r.fileName}: ${r.data.summary}`)
      .join('\n\n');

    const combinedKeywords = [
      ...new Set(
        successfulResults.flatMap(r => r.data.keywords || [])
      )
    ].slice(0, 10);

    // Generate a meta-summary of all documents
    const metaSummary = await openaiService.generateSummary(combinedSummaries, {
      length: options.summaryLength || 'medium',
      targetLanguage: options.targetLanguage,
      includeKeywords: false,
      includeSentiment: true
    });

    return {
      ...metaSummary,
      keywords: combinedKeywords,
      originalText: successfulResults.map(r => r.data.originalText).join('\n\n'),
      fileNames: successfulResults.map(r => r.fileName),
      documentCount: successfulResults.length,
      wordCount: {
        original: successfulResults.reduce((sum, r) => sum + (r.data.wordCount?.original || 0), 0),
        summary: metaSummary.wordCount.summary
      }
    };
  }
}

export const documentProcessor = new DocumentProcessor();