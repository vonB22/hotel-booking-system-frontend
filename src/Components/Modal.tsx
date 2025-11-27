import { X } from 'lucide-react';
import { useEffect } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'outline' | 'secondary';
  isLoading?: boolean;
  isDismissible?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  isDismissible = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDismissible) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDismissible, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (isDismissible && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full modal-content animate-slide-up overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h3>
          {isDismissible && !isLoading && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              aria-label="Close modal"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 text-gray-700 text-base leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button 
              variant={variant} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
