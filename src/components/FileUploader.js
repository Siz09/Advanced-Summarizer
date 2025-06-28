import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const FileUploader = ({ onProcessStart, onProcessComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach((file) => {
      toast.error(`${file.file.name} is not supported`);
    });

    // Handle accepted files
    acceptedFiles.forEach((file) => {
      const fileWithId = {
        ...file,
        id: Date.now() + Math.random(),
        status: 'ready'
      };
      setUploadedFiles(prev => [...prev, fileWithId]);
      toast.success(`${file.name} uploaded successfully`);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type === 'application/pdf') return File;
    return FileText;
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsProcessing(true);
    onProcessStart();

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock processed data
      const mockResult = {
        originalText: "This is a sample extracted text from your uploaded file(s). In a real implementation, this would contain the actual extracted content from PDF, DOCX, or image files using appropriate parsing libraries.",
        summary: "This is an AI-generated summary of your document. The summary captures the key points and main ideas while being significantly shorter than the original text.",
        translation: "Esta es una traducción generada por IA de su documento. El resumen captura los puntos clave y las ideas principales mientras es significativamente más corto que el texto original.",
        language: 'en',
        targetLanguage: 'es',
        sentiment: 'neutral',
        keywords: ['document', 'summary', 'AI', 'processing', 'text'],
        wordCount: {
          original: 1250,
          summary: 180
        },
        processingTime: 2.8
      };

      onProcessComplete(mockResult);
      toast.success('Files processed successfully!');
    } catch (error) {
      toast.error('Error processing files');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop files here' : 'Upload your documents'}
            </h3>
            <p className="text-white/70 mb-4">
              Drag & drop files here, or click to select
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-white/60">
              <span className="px-3 py-1 bg-white/10 rounded-full">PDF</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">DOCX</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">TXT</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Images</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-white font-medium">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/60 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Process Button */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={processFiles}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="spinner mr-2" />
                Processing Files...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Process Files
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* File Size Warning */}
      <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>Maximum file size: 10MB per file</span>
      </div>
    </div>
  );
};

export default FileUploader;