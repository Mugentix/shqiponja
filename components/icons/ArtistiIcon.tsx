
import React from 'react';

interface IconProps {
  className?: string;
}

const ArtistiIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
    aria-hidden="true"
  >
    {/* A painter's palette icon */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-4.5 .75h.008v.008H11.25v-.008zm0 0H9.75m6 0H18m1.5-1.5l-3.75-3.75M17.25 9.75a1.5 1.5 0 010-3 1.5 1.5 0 010 3zm-3.75 0a1.5 1.5 0 010-3 1.5 1.5 0 010 3zm-3.75 0a1.5 1.5 0 010-3 1.5 1.5 0 010 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-3.036 0-5.5-2.464-5.5-5.5S8.964 10.75 12 10.75s5.5 2.464 5.5 5.5-2.464 5.5-5.5 5.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 2.25A2.25 2.25 0 006.75 0H6a2.25 2.25 0 00-2.25 2.25v1.5A2.25 2.25 0 006 6h.75a2.25 2.25 0 002.25-2.25v-1.5zm9 0A2.25 2.25 0 0015.75 0H15a2.25 2.25 0 00-2.25 2.25v1.5A2.25 2.25 0 0015 6h.75a2.25 2.25 0 002.25-2.25v-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.038 12.75a2.25 2.25 0 01-1.288-1.288A5.503 5.503 0 0112 6.22a5.503 5.503 0 018.25 5.242 2.25 2.25 0 01-1.288 1.288H5.038z" transform="rotate(15 12 12.5)" />
  </svg>
);

export default ArtistiIcon;