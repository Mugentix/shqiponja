
import React from 'react';

interface ChangePersonaIconProps {
  className?: string;
}

const ChangePersonaIcon: React.FC<ChangePersonaIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.8} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5S14.485 14.25 12 14.25zm0 0v5.25m-4.5-5.25h9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25l-2.25-2.25m0 0l-2.25 2.25m2.25-2.25V7.5M4.5 14.25l2.25-2.25m0 0l2.25 2.25M6.75 12v4.5" />
 </svg>
);

export default ChangePersonaIcon;