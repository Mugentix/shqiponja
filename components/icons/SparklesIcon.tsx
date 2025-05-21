
import React from 'react';

interface SparklesIconProps {
  className?: string;
}

const SparklesIcon: React.FC<SparklesIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 013.09 3.09L25 12l-2.846.813a4.5 4.5 0 01-3.09 3.09L18.25 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L11.5 12l2.846-.813a4.5 4.5 0 013.09-3.09L18.25 7.5z" />
    {/* Adjusted path for better rendering, original path was for a 20x20 viewbox by default in some libs */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.75 7.5l.813 2.846a4.5 4.5 0 013.09 3.09L22.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09L16.25 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L9.5 12l2.846-.813a4.5 4.5 0 013.09-3.09L18.75 7.5z" transform="scale(0.8) translate(3,3)" />
  </svg>
);

export default SparklesIcon;