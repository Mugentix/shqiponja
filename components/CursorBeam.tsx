import React, { useEffect, useState } from 'react';

const CursorBeam = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="absolute w-[1000px] h-[1000px] bg-gradient-to-r from-red-500/10 to-red-600/10 blur-[150px] rounded-full transition-all duration-100"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(150px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export default CursorBeam; 