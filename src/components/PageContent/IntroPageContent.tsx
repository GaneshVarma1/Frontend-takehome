import React from 'react';
import { PageContent } from '../../types';

interface IntroPageContentProps {
  content: Extract<PageContent, { type: 'intro' }>;
  className?: string;
}

export const IntroPageContent: React.FC<IntroPageContentProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">
        {content.title}
      </h2>
      <p className="text-gray-600">
        {content.description}
      </p>
    </div>
  );
}; 