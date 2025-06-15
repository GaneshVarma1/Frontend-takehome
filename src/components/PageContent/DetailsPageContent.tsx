import React from 'react';
import { PageContent, FormData, FormDataChangeHandler } from '../../types';
import { CSS_CLASSES } from '../../utils/constants';

interface DetailsPageContentProps {
  content: Extract<PageContent, { type: 'details' }>;
  formData: FormData;
  onFieldChange: FormDataChangeHandler;
  getFieldError?: (fieldId: string) => string | undefined;
  className?: string;
}

export const DetailsPageContent: React.FC<DetailsPageContentProps> = ({
  content,
  formData,
  onFieldChange,
  getFieldError,
  className = '',
}) => {
  return (
    <div className={`max-w-md mx-auto space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
      <div className="space-y-4">
        {content.fields.map(field => {
          const fieldError = getFieldError?.(field.id);
          const hasError = Boolean(fieldError);
          
          return (
            <div key={field.id} className="space-y-2">
              <label 
                htmlFor={field.id} 
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                )}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={(formData[field.id] as string) || ''}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`
                    ${CSS_CLASSES.INPUT_BASE} 
                    ${CSS_CLASSES.FOCUS_RING}
                    ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  `}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.id}-error` : undefined}
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  id={field.id}
                  value={(formData[field.id] as string) || ''}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  className={`
                    ${CSS_CLASSES.INPUT_BASE} 
                    ${CSS_CLASSES.FOCUS_RING}
                    ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  `}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.id}-error` : undefined}
                >
                  <option value="">
                    {field.placeholder || `Select ${field.label.toLowerCase()}`}
                  </option>
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  value={(formData[field.id] as string) || ''}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`
                    ${CSS_CLASSES.INPUT_BASE} 
                    ${CSS_CLASSES.FOCUS_RING}
                    ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  `}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.id}-error` : undefined}
                />
              )}
              
              {hasError && (
                <p 
                  id={`${field.id}-error`}
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 