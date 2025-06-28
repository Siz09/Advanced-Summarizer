import mammoth from 'mammoth';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { openaiService } from './openaiService';

class DocumentProcessor {
  constructor() {
    // Configure PDF.js worker - use version that matches your pdfjs-dist package (4.0.379)
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;
  }

  async processFile(file, options = {}) {
    const { summaryLength = 'medium', targetLanguage = null } = options;
    
    try {
      // Validate file input
      if (!file) {
        throw new Error('No file provided');
      }

      // Get file information with safe fallbacks
      const fileType = (file.type || '').toLowerCase();
      const fileName = (file.name || '').toLowerCase();
      
      // Log for debugging
      console.log('Processing file:', fileName, 'type:', fileType);
      
      // Extract file extension safely
      const extension = fileName.includes('.') ? fileName.split('.').pop().trim() : '';
      
      let extractedText = '';
      
      // Determine file type with extension fallback and multiple MIME type support
      if (extension === 'pdf' || fileType === 'application/pdf' || fileType === 'application/x-pdf') {
        extractedText = await this.extractFromPDF(file);
      } else if (
        extension === 'docx' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        extractedText = await this.extractFromDOCX(file);
      } else if (fileType.startsWith('text/') || extension === 'txt') {
        extractedText = await this.extractFromText(file);
      } else if (
        fileType.startsWith('image/') ||
        ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)
      ) {
        extractedText = await this.extractFromImage(file);
      } else {
        throw new Error(`Unsupported file type: ${fileType || 'unknown'} (${fileName})`);
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
        fileName: fileName,
        fileType: fileType || `file.${extension}`,
        fileSize: file.size || 0
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
          fileName: file.name || 'unknown',
          data: result
        });
      } catch (error) {
        results.push({
          success: false,
          fileName: file.name || 'unknown',
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