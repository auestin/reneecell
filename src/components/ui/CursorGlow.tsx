'use client';

import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'soft-light',
        transition: 'width 0.2s, height 0.2s',
      }}
    />
  );
}
