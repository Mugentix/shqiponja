
import React from 'react';

interface MegaphoneIconProps {
  className?: string;
}

const MegaphoneIcon: React.FC<MegaphoneIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9.75 0h.008v.008H10.5V21zm0 0H5.25M5.25 21L3 13.5m0 0L7.5 3l3.75 10.5M3 13.5H7.5m0 0c-.621 0-1.125.504-1.125 1.125v3.006c0 .621.504 1.125 1.125 1.125H17.25c.621 0 1.125-.504 1.125-1.125v-3.006c0-.621-.504-1.125-1.125-1.125H7.5z" />
  </svg>
);

export default MegaphoneIcon;