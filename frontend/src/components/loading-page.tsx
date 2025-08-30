import React from 'react'


import { Loader2, Car } from 'lucide-react';

interface LoadingPageProps {
  text?: string;
  showLogo?: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  text = "Loading...",
  showLogo = true
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center space-y-4">
        {showLogo && (
          <div className="p-4 bg-blue-600 rounded-full animate-pulse">
            <Car className="w-12 h-12 text-white" />
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {text}
          </span>
        </div>

        <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
