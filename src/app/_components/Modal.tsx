import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'lg'
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Size classes
  const sizeClasses = {
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[90vw] h-[85vh]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with improved animation */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-80' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal with improved design */}
      <div 
        className={`z-50 max-h-[90vh] w-full ${sizeClasses[size]} overflow-hidden rounded-xl 
        bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl transition-all duration-300
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        border border-purple-500/20`}
      >
        {/* Header with subtle purple accent */}
        <div className="flex items-center justify-between border-b border-zinc-700/50 p-4 bg-zinc-900/80">
          {title && (
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-purple-400"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content with better scrolling */}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;