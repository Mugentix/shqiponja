
import React from 'react';

interface CopyIconProps {
  className?: string;
}

const CopyIcon: React.FC<CopyIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125V7.5m0 10.5h6.75m-6.75 0V7.5m6.75 0h3.75M3.375 7.5h17.25M3.375 7.5c0-1.036.84-1.875 1.875-1.875h13.5c1.036 0 1.875.84 1.875 1.875v10.5c0 1.036-.84 1.875-1.875 1.875h-13.5c-1.036 0-1.875-.84-1.875-1.875V7.5z" />
  </svg>
);

export default CopyIcon;
