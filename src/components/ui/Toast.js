import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 4000,
  onClose,
  action,
  position = 'top-right'
}) => {
  const { isDark } = useTheme();

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: isDark 
      ? 'bg-green-800 border-green-700 text-green-100' 
      : 'bg-green-50 border-green-200 text-green-800',
    error: isDark 
      ? 'bg-red-800 border-red-700 text-red-100' 
      : 'bg-red-50 border-red-200 text-red-800',
    warning: isDark 
      ? 'bg-yellow-800 border-yellow-700 text-yellow-100' 
      : 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: isDark 
      ? 'bg-blue-800 border-blue-700 text-blue-100' 
      : 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const Icon = icons[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const toastVariants = {
    initial: { 
      opacity: 0, 
      y: position.includes('top') ? -50 : 50,
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: position.includes('top') ? -50 : 50,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        max-w-sm w-full pointer-events-auto rounded-lg border shadow-lg
        ${colors[type]}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            {message && (
              <p className={`text-sm ${title ? 'mt-1' : ''} opacity-90`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => onClose(id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="h-1 bg-current opacity-30"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, onClose, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <div className="space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={onClose}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Toast;