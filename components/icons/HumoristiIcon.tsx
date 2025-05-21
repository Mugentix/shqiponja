
import React from 'react';

interface IconProps {
  className?: string;
}

const HumoristiIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    {/* Laughing face icon */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 9.75a.75.75 0 00-1.5 0V10.5a.75.75 0 001.5 0V9.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 9.75a.75.75 0 011.5 0V10.5a.75.75 0 01-1.5 0V9.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25s1.25 1.5 3 1.5 3-1.5 3-1.5" />
  </svg>
);

export default HumoristiIcon;