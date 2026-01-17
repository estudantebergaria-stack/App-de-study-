
import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  theme = 'dark'
}) => {
  const onCloseRef = useRef(onClose);
  
  // Update ref when onClose changes
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Reset timer when message changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, message]); // Added message to dependencies to reset timer on message change

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      dark: 'bg-zinc-900 border-emerald-500/50 text-white',
      light: 'bg-white border-emerald-200 text-zinc-900',
      icon: 'text-emerald-500',
      dot: 'bg-emerald-500'
    },
    error: {
      dark: 'bg-zinc-900 border-red-500/50 text-white',
      light: 'bg-white border-red-200 text-zinc-900',
      icon: 'text-red-500',
      dot: 'bg-red-500'
    },
    info: {
      dark: 'bg-zinc-900 border-blue-500/50 text-white',
      light: 'bg-white border-blue-200 text-zinc-900',
      icon: 'text-blue-500',
      dot: 'bg-blue-500'
    }
  };

  const Icon = icons[type];
  const colorScheme = colors[type];
  const bgClass = theme === 'light' ? colorScheme.light : colorScheme.dark;

  return (
    <div className={`fixed bottom-8 right-8 z-50 animate-fade-in max-w-md`}>
      <div className={`px-6 py-4 rounded-2xl shadow-2xl border-2 ${bgClass} flex items-center gap-3`}>
        <Icon className={colorScheme.icon} size={20} />
        <span className="font-bold text-sm flex-1">{message}</span>
        <button 
          onClick={onClose}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
