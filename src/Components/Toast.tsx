import { useState } from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message, duration };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration = 3000) => addToast(message, 'success', duration);
  const error = (message: string, duration = 4000) => addToast(message, 'error', duration);
  const info = (message: string, duration = 3000) => addToast(message, 'info', duration);

  return { toasts, addToast, removeToast, success, error, info };
};

const ToastItem = ({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[toast.type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[toast.type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle,
  }[toast.type];

  const iconColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }[toast.type];

  const closeButtonColor = {
    success: 'hover:text-green-600',
    error: 'hover:text-red-600',
    info: 'hover:text-blue-600',
  }[toast.type];

  return (
    <div className={`${bgColor} border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-slide-in transition-all`}>
      <Icon className={`${iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`${textColor} text-sm font-medium`}>{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className={`text-gray-400 ${closeButtonColor} flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors`}
        title="Dismiss"
        aria-label="Dismiss notification"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: string) => void }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-6 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>
  );
};
