import React from 'react';
import { FormPage, FormData, FormDataChangeHandler } from '../types';
import { 
  IntroPageContent, 
  DetailsPageContent, 
  MoodPageContent, 
  EndingPageContent 
} from './PageContent';

interface PageRendererProps {
  page: FormPage;
  formData: FormData;
  onFieldChange: FormDataChangeHandler;
  getFieldError?: (fieldId: string) => string | undefined;
  className?: string;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  formData,
  onFieldChange,
  getFieldError,
  className = '',
}) => {
  // Type-safe rendering using discriminated unions
  switch (page.content.type) {
    case 'intro':
      return (
        <IntroPageContent 
          content={page.content} 
          className={className}
        />
      );

    case 'details':
      return (
        <DetailsPageContent
          content={page.content}
          formData={formData}
          onFieldChange={onFieldChange}
          getFieldError={getFieldError}
          className={className}
        />
      );

    case 'mood':
      return (
        <MoodPageContent
          content={page.content}
          formData={formData}
          onFieldChange={onFieldChange}
          className={className}
        />
      );

    case 'ending':
      return (
        <EndingPageContent
          content={page.content}
          formData={formData}
          className={className}
        />
      );

    default: {
      // This should never happen with proper TypeScript types
      const exhaustiveCheck: never = page.content;
      console.error('Unknown page content type:', exhaustiveCheck);
      return (
        <div className={`text-center text-red-600 ${className}`}>
          <p>Error: Unknown page type</p>
        </div>
      );
    }
  }
}; 