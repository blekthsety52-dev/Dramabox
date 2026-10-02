import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'reward';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-auto max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-medium shadow-2xl border border-white/10 animate-fade-in transition-all duration-200"
        >
          {toast.type === 'reward' ? (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
