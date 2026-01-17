
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  theme?: 'dark' | 'light';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all ${
        isLight 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'bg-indigo-500/10 text-indigo-400'
      }`}>
        <Icon size={40} strokeWidth={1.5} />
      </div>
      
      <h3 className={`text-2xl font-bold mb-3 ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}>
        {title}
      </h3>
      
      <p className={`text-base max-w-md mb-8 leading-relaxed ${
        isLight ? 'text-slate-500' : 'text-zinc-400'
      }`}>
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
            isLight 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/50'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
