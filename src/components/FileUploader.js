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
  AlertCircle,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { documentProcessor } from '../services/documentProcessor';
import { openaiService } from '../services/openaiService';
import Button from './ui/Button';

const FileUploader = ({ onProcessStart, onProcessComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const languages = [
    { code: '', name: 'No Translation' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach((file) => {
      toast.error(`${file.file.name} is not supported`);
    });

    // Handle accepted files - preserve original File object
    acceptedFiles.forEach((file) => {
      // Debug logging
      console.log('Dropped file:', file.name, 'type:', file.type, 'size:', file.size);
      
      const fileWithId = {
        file, // Keep original File object here
        id: Date.now() + Math.random(),
        status: 'ready',
        // Add convenience properties for UI
        name: file.name,
        type: file.type,
        size: file.size
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

  const getFileIcon = (fileItem) => {
    const fileType = fileItem.type || fileItem.file?.type || '';
    
    if (!fileType || typeof fileType !== 'string') return FileText;
  
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType === 'application/pdf') return File;
    if (fileType.startsWith('text/')) return FileText;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return FileText;
  
    return FileText;
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    if (!openaiService.isConfigured()) {
      toast.error('OpenAI API key not configured. Please add your API key to the .env file.');
      return;
    }

    setIsProcessing(true);
    onProcessStart();

    try {
      const startTime = Date.now();
      
      // Update file statuses to processing
      setUploadedFiles(prev => 
        prev.map(file => ({ ...file, status: 'processing' }))
      );

      const options = {
        summaryLength,
        targetLanguage: targetLanguage || null
      };

      let result;

      if (uploadedFiles.length === 1) {
        // Process single file - pass the original File object
        console.log('Processing single file:', uploadedFiles[0].file);
        result = await documentProcessor.processFile(uploadedFiles[0].file, options);
      } else {
        // Process multiple files - pass original File objects
        const originalFiles = uploadedFiles.map(f => f.file);
        console.log('Processing multiple files:', originalFiles);
        const results = await documentProcessor.processMultipleFiles(originalFiles, options);
        result = await documentProcessor.combineDocumentSummaries(results, options);
      }

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      result.processingTime = parseFloat(processingTime);

      // Update file statuses to completed
      setUploadedFiles(prev => 
        prev.map(file => ({ ...file, status: 'completed' }))
      );

      onProcessComplete(result);
      toast.success('Files processed successfully!');
      
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.message || 'Error processing files');
      
      // Update file statuses to error
      setUploadedFiles(prev => 
        prev.map(file => ({ ...file, status: 'error' }))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <div className="spinner w-4 h-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showSettings ? 1 : 0, 
          height: showSettings ? 'auto' : 0 
        }}
        className="overflow-hidden"
      >
        <div className="glass rounded-xl p-6 border border-white/20 space-y-4">
          <h3 className="text-white font-semibold mb-4">Processing Settings</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Summary Length
              </label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (2-3 sentences)</option>
                <option value="medium">Medium (1-2 paragraphs)</option>
                <option value="long">Long (3-4 paragraphs)</option>
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Translate To
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Upload Documents</h2>
        <Button
          variant="ghost"
          size="sm"
          icon={Settings}
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </Button>
      </div>

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

      {/* API Key Warning */}
      {!openaiService.isConfigured() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-yellow-200 font-medium">OpenAI API Key Required</p>
              <p className="text-yellow-200/80 text-sm">
                Add your OpenAI API key to the .env file as REACT_APP_OPENAI_API_KEY to enable AI processing.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-white font-medium">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((fileItem) => {
            const FileIcon = getFileIcon(fileItem);
            return (
              <motion.div
                key={fileItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{fileItem.name}</p>
                    <p className="text-white/60 text-sm">
                      {(fileItem.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={getStatusColor(fileItem.status)}>
                    {getStatusIcon(fileItem.status)}
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="p-1 text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
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
          <Button
            variant="primary"
            size="lg"
            onClick={processFiles}
            disabled={isProcessing || !openaiService.isConfigured()}
            loading={isProcessing}
            icon={Upload}
            className="mx-auto"
          >
            {isProcessing ? 'Processing Files...' : 'Process Files with AI'}
          </Button>
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