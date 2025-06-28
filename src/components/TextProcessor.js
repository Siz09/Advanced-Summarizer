import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Type, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  Play,
  Square,
  Zap,
  AlertCircle,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { openaiService } from '../services/openaiService';
import Button from './ui/Button';

const TextProcessor = ({ mode, onProcessStart, onProcessComplete }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!openaiService.isConfigured()) {
      toast.error('OpenAI API key not configured for voice recording');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      toast.error('Could not access microphone');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      toast.success('Recording stopped, transcribing...');
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const transcription = await openaiService.speechToText(audioBlob);
      setText(transcription);
      toast.success('Speech converted to text');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!openaiService.isConfigured()) {
      toast.error('OpenAI API key not configured for image processing');
      return;
    }
    
    setSelectedImage(file);
    toast.loading('Extracting text from image...');
    
    try {
      const extractedText = await openaiService.extractTextFromImage(file);
      setText(extractedText);
      toast.dismiss();
      toast.success('Text extracted from image');
    } catch (error) {
      console.error('OCR error:', error);
      toast.dismiss();
      toast.error('Failed to extract text from image');
    }
  };

  const processText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to process');
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
      
      const options = {
        length: summaryLength,
        targetLanguage: targetLanguage || null,
        includeKeywords: true,
        includeSentiment: true
      };

      const result = await openaiService.generateSummary(text, options);
      
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      result.processingTime = parseFloat(processingTime);
      result.originalText = text;

      onProcessComplete(result);
      toast.success('Text processed successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.message || 'Error processing text');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (mode) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Enter or Paste Text</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Settings}
                onClick={() => setShowSettings(!showSettings)}
              >
                Settings
              </Button>
            </div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showSettings ? 1 : 0, 
                height: showSettings ? 'auto' : 0 
              }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 border border-white/20 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Summary Length
                    </label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Translate To
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here or start typing..."
              className="w-full h-64 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center text-sm text-white/60">
              <span>{text.length} characters</span>
              <span>{text.split(' ').filter(word => word.length > 0).length} words</span>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Voice Recording</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Settings}
                onClick={() => setShowSettings(!showSettings)}
              >
                Settings
              </Button>
            </div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showSettings ? 1 : 0, 
                height: showSettings ? 'auto' : 0 
              }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 border border-white/20 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Summary Length
                    </label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Translate To
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className={`w-full h-full rounded-full border-4 flex items-center justify-center ${
                  isRecording 
                    ? 'border-red-500 bg-red-500/20 animate-pulse' 
                    : 'border-white/30 bg-white/10'
                }`}>
                  {isRecording ? (
                    <MicOff className="h-12 w-12 text-red-400" />
                  ) : (
                    <Mic className="h-12 w-12 text-white" />
                  )}
                </div>
                {isRecording && (
                  <div className="absolute -inset-4 border-2 border-red-500/50 rounded-full animate-ping"></div>
                )}
              </div>

              {isRecording && (
                <div className="text-white mb-4">
                  <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                  <div className="text-white/70">Recording in progress...</div>
                </div>
              )}

              <Button
                variant={isRecording ? "danger" : "primary"}
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!openaiService.isConfigured()}
                icon={isRecording ? Square : Play}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>

            {text && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Transcribed Text:</h4>
                <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
                  <p className="text-white/90">{text}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Image OCR</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Settings}
                onClick={() => setShowSettings(!showSettings)}
              >
                Settings
              </Button>
            </div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showSettings ? 1 : 0, 
                height: showSettings ? 'auto' : 0 
              }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-4 border border-white/20 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Summary Length
                    </label>
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Translate To
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <motion.div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/30 rounded-xl p-8 cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Upload Image</h4>
                <p className="text-white/70 mb-4">
                  Click to select an image with text to extract
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-white/60">
                  <span className="px-3 py-1 bg-white/10 rounded-full">PNG</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full">JPG</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full">GIF</span>
                </div>
              </motion.div>

              {selectedImage && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-2">Selected Image:</h4>
                  <div className="inline-block p-2 bg-white/10 rounded-lg">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="max-w-full max-h-48 rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {text && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Extracted Text:</h4>
                <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
                  <p className="text-white/90">{text}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

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

      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6 border-t border-white/20"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={processText}
            disabled={isProcessing || !openaiService.isConfigured()}
            loading={isProcessing}
            icon={Zap}
          >
            {isProcessing ? 'Processing Text...' : 'Summarize & Translate with AI'}
          </Button>
        </motion.div>
      )}

      {mode === 'voice' && (
        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Make sure your microphone is enabled</span>
        </div>
      )}

      {mode === 'image' && (
        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Maximum image size: 5MB</span>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;