import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Download, 
  Volume2, 
  VolumeX,
  Share2, 
  Star,
  Globe,
  FileText,
  BarChart3,
  Clock,
  Hash,
  Heart,
  Meh,
  Frown,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResultsPanel = ({ data, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);

  const tabs = [
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'translation', name: 'Translation', icon: Globe },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Text-to-speech failed');
      };
      
      speechSynthesis.speak(utterance);
      toast.success('Playing audio...');
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SwiftSummary Pro - Document Summary',
          text: data.summary,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return Heart;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/20 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <h3 className="text-xl font-semibold text-white">Processing Your Content</h3>
          <p className="text-white/70">Our AI is analyzing and summarizing your document...</p>
          <div className="flex space-x-2">
            {['Extracting text', 'Analyzing content', 'Generating summary', 'Translating'].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
              >
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Processing Complete</h2>
            <div className="flex items-center space-x-4 text-sm text-white/70">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{data.processingTime}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Hash className="h-4 w-4" />
                <span>{data.wordCount.original} → {data.wordCount.summary} words</span>
              </div>
              <div className="flex items-center space-x-1">
                {React.createElement(getSentimentIcon(data.sentiment), { 
                  className: `h-4 w-4 ${getSentimentColor(data.sentiment)}` 
                })}
                <span className={getSentimentColor(data.sentiment)}>
                  {data.sentiment}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTextToSpeech(data.summary)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Text to Speech"
            >
              {isPlaying ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-white/10 text-white border-b-2 border-blue-400'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(data.summary)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Copy Summary"
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDownload(data.summary, 'summary.txt')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Download Summary"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/90 leading-relaxed">{data.summary}</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-white/90 text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Rate this Summary</h4>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-colors duration-200 ${
                      star <= rating ? 'text-yellow-400' : 'text-white/30'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-white/70 ml-2">
                    Thanks for your feedback!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'translation' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  Translation ({data.language} → {data.targetLanguage})
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(data.translation)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Copy Translation"
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDownload(data.translation, 'translation.txt')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Download Translation"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/90 leading-relaxed">{data.translation}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Original Language</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-white/80 capitalize">{data.language}</span>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Target Language</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-white/80 capitalize">{data.targetLanguage}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h4 className="text-white font-medium">Word Count</h4>
                </div>
                <p className="text-2xl font-bold text-white">{data.wordCount.original}</p>
                <p className="text-blue-300 text-sm">Original document</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h4 className="text-white font-medium">Summary</h4>
                </div>
                <p className="text-2xl font-bold text-white">{data.wordCount.summary}</p>
                <p className="text-green-300 text-sm">
                  {Math.round((1 - data.wordCount.summary / data.wordCount.original) * 100)}% reduction
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <h4 className="text-white font-medium">Processing Time</h4>
                </div>
                <p className="text-2xl font-bold text-white">{data.processingTime}s</p>
                <p className="text-purple-300 text-sm">AI analysis</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-3">Content Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Sentiment</span>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getSentimentIcon(data.sentiment), { 
                      className: `h-4 w-4 ${getSentimentColor(data.sentiment)}` 
                    })}
                    <span className={`capitalize ${getSentimentColor(data.sentiment)}`}>
                      {data.sentiment}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Key Topics</span>
                  <span className="text-white">{data.keywords.length} identified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Language</span>
                  <span className="text-white capitalize">{data.language}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultsPanel;