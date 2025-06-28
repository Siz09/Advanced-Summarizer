import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Mic, 
  Image as ImageIcon,
  Zap,
  Globe,
  Volume2,
  Download,
  Star,
  CheckCircle
} from 'lucide-react';
import FileUploader from '../components/FileUploader';
import TextProcessor from '../components/TextProcessor';
import ResultsPanel from '../components/ResultsPanel';

const Home = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputMethods = [
    {
      id: 'upload',
      name: 'Upload File',
      icon: Upload,
      description: 'PDF, DOCX, TXT files',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'text',
      name: 'Paste Text',
      icon: FileText,
      description: 'Type or paste content',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'voice',
      name: 'Voice Input',
      icon: Mic,
      description: 'Record speech',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'image',
      name: 'Image OCR',
      icon: ImageIcon,
      description: 'Extract text from images',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Summarization',
      description: 'Advanced GPT-4 technology for accurate, contextual summaries'
    },
    {
      icon: Globe,
      title: 'Multi-Language Translation',
      description: 'Translate summaries into 100+ languages instantly'
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Listen to your summaries with natural voice synthesis'
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Download as PDF, DOCX, or share with public links'
    }
  ];

  const handleProcessComplete = (data) => {
    setProcessedData(data);
    setIsProcessing(false);
  };

  const handleProcessStart = () => {
    setIsProcessing(true);
    setProcessedData(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          AI-Powered Document
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {' '}Summarization
          </span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform lengthy documents into concise, actionable summaries. 
          Upload files, paste text, or record speech - our AI does the rest.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['PDF', 'DOCX', 'TXT', 'Voice', 'Images'].map((format, index) => (
            <motion.span
              key={format}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium backdrop-blur-sm border border-white/20"
            >
              {format}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Input Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-2xl p-8 mb-8 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Choose Your Input Method
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {inputMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveTab(method.id)}
              className={`p-6 rounded-xl transition-all duration-200 border-2 ${
                activeTab === method.id
                  ? 'border-white/50 bg-white/20 scale-105'
                  : 'border-white/20 bg-white/10 hover:bg-white/15 hover:scale-102'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-3`}>
                <method.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">{method.name}</h3>
              <p className="text-white/70 text-sm">{method.description}</p>
            </button>
          ))}
        </div>

        {/* Input Components */}
        <div className="min-h-[400px]">
          {activeTab === 'upload' && (
            <FileUploader 
              onProcessStart={handleProcessStart}
              onProcessComplete={handleProcessComplete}
            />
          )}
          {(activeTab === 'text' || activeTab === 'voice' || activeTab === 'image') && (
            <TextProcessor 
              mode={activeTab}
              onProcessStart={handleProcessStart}
              onProcessComplete={handleProcessComplete}
            />
          )}
        </div>
      </motion.div>

      {/* Results Panel */}
      {(processedData || isProcessing) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ResultsPanel 
            data={processedData}
            isProcessing={isProcessing}
          />
        </motion.div>
      )}

      {/* Features Section */}
      {!processedData && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* CTA Section */}
      {!processedData && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center glass rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who save hours every day with AI-powered summarization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="text-white/90 ml-2 font-medium">4.9/5 from 10,000+ users</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Secure & private</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;