'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/chariscell/main_visual01.jpg',
  '/images/chariscell/main_visual02.jpg',
  '/images/chariscell/main_visual03.jpg',
  '/images/chariscell/main_visual04.jpg',
  '/images/chariscell/main_visual05.jpg',
  '/images/chariscell/main_visual06.jpg',
  '/images/chariscell/main_visual07.jpg',
  '/images/chariscell/main_visual08.jpg',
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5秒切換一次
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider-section">
      <div className="luxurious-gold-frame">
        <div className="luxurious-gold-frame-inner">
          {images.map((src, index) => (
            <div 
              key={src}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: index === currentIndex ? 1 : 0,
                backgroundColor: '#111'
              }}
            >
              <Image
                src={`${src}?v=3`} /* Cache buster for the new layout */
                alt={`Rene Cell Banner ${index + 1}`}
                fill
                quality={100} 
                unoptimized={true} 
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={true} // 全面強制優先載入
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
