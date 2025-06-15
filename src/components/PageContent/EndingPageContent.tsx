import React from 'react';
import { PageContent, FormData } from '../../types';

interface EndingPageContentProps {
  content: Extract<PageContent, { type: 'ending' }>;
  formData: FormData;
  className?: string;
}

export const EndingPageContent: React.FC<EndingPageContentProps> = ({
  content,
  formData,
  className = '',
}) => {
  const userName = formData.name as string;
  const userMood = formData.mood as string;

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900">
        {content.message}
      </h2>
      
      {content.showName && userName && (
        <p className="text-xl text-gray-700">
          Thanks, <span className="font-semibold text-orange-600">{userName}</span>!
        </p>
      )}
      
      {content.showMood && userMood && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Your mood today:</p>
          <p className="text-4xl" role="img" aria-label={`Selected mood: ${userMood}`}>
            {userMood}
          </p>
        </div>
      )}
      
      {(content.showName && userName) || (content.showMood && userMood) ? (
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            Your responses have been recorded successfully!
          </p>
        </div>
      ) : null}
    </div>
  );
}; 