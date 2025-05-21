
import React from 'react';

interface IconProps {
  className?: string;
}

const AnalistiIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 20.25h16.5M3.75 12H20.25m-16.5 0V21m16.5-9V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h3M7.5 10.5h6M15 7.5h1.5m-1.5 3h1.5" />
    {/* Represents a newspaper or news feed */}
  </svg>
);

export default AnalistiIcon;