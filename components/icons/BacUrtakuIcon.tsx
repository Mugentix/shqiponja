
import React from 'react';

interface IconProps {
  className?: string;
}

const BacUrtakuIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.879 17.121A7.502 7.502 0 0012 21.75a7.502 7.502 0 007.121-4.629M12 18.75v-3.75m0 0A3.375 3.375 0 0115.375 11.25h.001A3.375 3.375 0 0112 15m0 0A3.375 3.375 0 008.625 11.25h-.001A3.375 3.375 0 0012 15m-6.375 1.125a2.25 2.25 0 011.82-1.82M18.375 16.125a2.25 2.25 0 001.82-1.82" />
    {/* Simple representation of a wise old man - could be a stylized beard or glasses */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75S8.25 18 12 18s4.5-2.25 4.5-2.25" /> 
  </svg>
);

export default BacUrtakuIcon;