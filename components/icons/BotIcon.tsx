
import React from 'react';

interface BotIconProps {
  className?: string;
}

const BotIcon: React.FC<BotIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0"/>
    <circle cx="8.5" cy="10.5" r="1.5" />
    <circle cx="15.5" cy="10.5" r="1.5" />
    <path d="M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/>
  </svg>
);

export default BotIcon;