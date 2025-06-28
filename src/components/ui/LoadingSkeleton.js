import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingSkeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height = '1rem',
  className = '',
  count = 1,
  ...props 
}) => {
  const { isDark } = useTheme();

  const baseClasses = `animate-pulse rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`;

  const variants = {
    text: 'h-4',
    title: 'h-6',
    avatar: 'rounded-full',
    card: 'h-32',
    button: 'h-10',
    image: 'aspect-video',
  };

  const skeletonElement = (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ width, height: variant === 'text' || variant === 'title' ? undefined : height }}
      {...props}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {skeletonElement}
        </div>
      ))}
    </div>
  );
};

// Predefined skeleton components for common use cases
export const TextSkeleton = ({ lines = 3, ...props }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }, (_, index) => (
      <LoadingSkeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '75%' : '100%'}
        {...props}
      />
    ))}
  </div>
);

export const CardSkeleton = ({ showAvatar = false, showButton = false, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3 mb-4">
          <LoadingSkeleton variant="avatar" width="2.5rem" height="2.5rem" />
          <div className="flex-1">
            <LoadingSkeleton variant="text" width="40%" />
            <LoadingSkeleton variant="text" width="60%" className="mt-1" />
          </div>
        </div>
      )}
      <LoadingSkeleton variant="title" width="80%" className="mb-3" />
      <TextSkeleton lines={3} className="mb-4" />
      {showButton && (
        <LoadingSkeleton variant="button" width="30%" />
      )}
    </div>
  );
};

export const ListSkeleton = ({ items = 5, showAvatar = false }) => (
  <div className="space-y-4">
    {Array.from({ length: items }, (_, index) => (
      <CardSkeleton key={index} showAvatar={showAvatar} />
    ))}
  </div>
);

export default LoadingSkeleton;