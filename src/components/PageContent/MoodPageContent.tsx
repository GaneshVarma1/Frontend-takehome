import React from 'react';
import { PageContent, FormData, FormDataChangeHandler } from '../../types';
import { CSS_CLASSES } from '../../utils/constants';

interface MoodPageContentProps {
  content: Extract<PageContent, { type: 'mood' }>;
  formData: FormData;
  onFieldChange: FormDataChangeHandler;
  className?: string;
}

export const MoodPageContent: React.FC<MoodPageContentProps> = ({
  content,
  formData,
  onFieldChange,
  className = '',
}) => {
  const selectedMood = formData.mood as string;

  return (
    <div className={`text-center space-y-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900">
        {content.question}
      </h2>
      
      <div 
        className="flex justify-center gap-4"
        role="radiogroup"
        aria-labelledby="mood-question"
      >
        {content.options.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            onClick={() => onFieldChange('mood', emoji)}
            className={`
              text-4xl p-2 rounded-full transition-all duration-200
              ${CSS_CLASSES.FOCUS_RING}
              ${selectedMood === emoji 
                ? 'bg-orange-100 scale-110 ring-2 ring-orange-300' 
                : 'hover:bg-gray-100 hover:scale-105'
              }
            `}
            role="radio"
            aria-checked={selectedMood === emoji}
            aria-label={`Select mood: ${emoji}`}
            tabIndex={0}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Selected mood: <span className="text-2xl">{selectedMood}</span>
          </p>
        </div>
      )}
    </div>
  );
}; 