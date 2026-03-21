import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
  hideSubtitleOnMobile?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "", 
  size = 'md', 
  showText = true,
  light = false,
  hideSubtitleOnMobile = false
}) => {
  const sizes = {
    sm: { h: 24, font: 'text-xl' },
    md: { h: 40, font: 'text-3xl' },
    lg: { h: 64, font: 'text-5xl' },
    xl: { h: 96, font: 'text-7xl' }
  };

  const currentSize = sizes[size];
  const textColor = light ? 'text-white' : 'text-deep-blue';
  const pinkColor = "#FF4DB8";

  return (
    <div 
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label="MIACompass Logo"
    >
      {showText && (
        <span className={`font-black tracking-tighter uppercase ${textColor} ${currentSize.font}`}>
          MIAC
        </span>
      )}
      
      <svg 
        width={currentSize.h} 
        height={currentSize.h} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mx-0.5 flex-shrink-0"
      >
        {/* Outer Circle */}
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" className={textColor} />
        
        {/* Crosshairs - small ticks */}
        <line x1="50" y1="8" x2="50" y2="18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className={textColor} />
        <line x1="50" y1="82" x2="50" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className={textColor} />
        <line x1="8" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className={textColor} />
        <line x1="82" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className={textColor} />
        
        {/* Compass Needle - Top Half */}
        <path 
          d="M50 15L65 50L50 50L50 15Z" 
          fill={pinkColor} 
        />
        <path 
          d="M50 15L35 50L50 50L50 15Z" 
          fill={pinkColor}
          opacity="0.8"
        />
        
        {/* Compass Needle - Bottom Half */}
        <path 
          d="M50 85L65 50L50 50L50 85Z" 
          fill={textColor === 'text-white' ? 'white' : '#00BCD4'}
          opacity="0.6"
        />
        <path 
          d="M50 85L35 50L50 50L50 85Z" 
          fill={textColor === 'text-white' ? 'white' : '#00BCD4'}
          opacity="0.4"
        />
        
        {/* Center Dot */}
        <circle cx="50" cy="50" r="5" fill="white" stroke={pinkColor} strokeWidth="2" />
      </svg>

      {showText && (
        <span className={`font-black tracking-tighter uppercase ${textColor} ${currentSize.font}`}>
          MPASS
        </span>
      )}
    </div>
  );
};
