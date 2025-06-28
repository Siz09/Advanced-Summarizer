import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Type, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  Upload,
  Play,
  Square,
  Zap,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const TextProcessor = ({ mode, onProcessStart, onProcessComplete }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // In a real app, you would send this to a speech-to-text service
        simulateSpeechToText();
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
      toast.success('Recording stopped');
    }
  };

  const simulateSpeechToText = () => {
    // Simulate speech-to-text conversion
    setTimeout(() => {
      const mockTranscription = "This is a sample transcription from your voice recording. In a real implementation, this would be the actual transcribed text from your speech using services like Google Speech-to-Text or OpenAI Whisper.";
      setText(mockTranscription);
      toast.success('Speech converted to text');
    }, 2000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Simulate OCR processing
      setTimeout(() => {
        const mockOCRText = "This is sample text extracted from your image using OCR (Optical Character Recognition). In a real implementation, this would be the actual text extracted from your uploaded image using services like Tesseract.js or Google Vision API.";
        setText(mockOCRText);
        toast.success('Text extracted from image');
      }, 3000);
    }
  };

  const processText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    onProcessStart();

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult = {
        originalText: text,
        summary: "This is an AI-generated summary of your text. The summary captures the key points and main ideas while being significantly shorter than the original content.",
        translation: "Este es un resumen generado por IA de su texto. El resumen captura los puntos clave y las ideas principales mientras es significativamente más corto que el contenido original.",
        language: 'en',
        targetLanguage: 'es',
        sentiment: 'neutral',
        keywords: ['text', 'summary', 'AI', 'processing', 'content'],
        wordCount: {
          original: text.split(' ').length,
          summary: 25
        },
        processingTime: 2.1
      };

      onProcessComplete(mockResult);
      toast.success('Text processed successfully!');
    } catch (error) {
      toast.error('Error processing text');
      console.error('Processing error:', error);
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
            <div className="flex items-center space-x-2 mb-4">
              <Type className="h-5 w-5 text-white" />
              <h3 className="text-white font-semibold">Enter or Paste Text</h3>
            </div>
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
            <div className="flex items-center space-x-2 mb-4">
              <Mic className="h-5 w-5 text-white" />
              <h3 className="text-white font-semibold">Voice Recording</h3>
            </div>
            
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

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-5 w-5 mr-2 inline" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2 inline" />
                    Start Recording
                  </>
                )}
              </button>
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
            <div className="flex items-center space-x-2 mb-4">
              <ImageIcon className="h-5 w-5 text-white" />
              <h3 className="text-white font-semibold">Image OCR</h3>
            </div>

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

      {text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6 border-t border-white/20"
        >
          <button
            onClick={processText}
            disabled={isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="spinner mr-2" />
                Processing Text...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Summarize & Translate
              </>
            )}
          </button>
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