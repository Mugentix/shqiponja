import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-2 p-3 bg-red-700/50 rounded-2xl">
      <div className="w-2 h-2 bg-red-300 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-red-300 rounded-full animate-typing" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-red-300 rounded-full animate-typing" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default TypingIndicator; 