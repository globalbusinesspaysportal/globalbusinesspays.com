import React, { memo } from 'react';

// Use memo to prevent unnecessary re-renders
export const NasaWorldMap = memo(() => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* NASA Earth image as background - with direct URL and optimized loading */}
      <div 
        className="absolute inset-0 bg-slate-950" 
        style={{ 
          backgroundImage: 'url(/earth-nasa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform', // Hardware acceleration hint
          transform: 'translateZ(0)' // Force GPU rendering
        }}
      ></div>
      
      {/* Overlay for better readability and contrast */}
      <div className="absolute inset-0 bg-slate-950/50"></div>
      
      {/* SVG overlay for connections and animations - reduced complexity */}
      <svg 
        viewBox="0 0 1200 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ willChange: 'transform' }} // Hardware acceleration hint
      >
        {/* Connection lines between major financial centers - static */}
        <g className="connection-lines">
          {/* Main connection lines - reduced to essential routes */}
          <line x1="250" y1="160" x2="455" y2="145" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="455" y1="145" x2="480" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="480" y1="150" x2="560" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="455" y1="145" x2="535" y2="210" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="535" y1="210" x2="590" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="590" y1="230" x2="680" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="680" y1="230" x2="735" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="680" y1="230" x2="650" y2="280" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="650" y1="280" x2="735" y2="375" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
        </g>
        
        {/* Animated connection pulses - reduced quantity to improve performance */}
        <g>
          {/* NY to London - keeping only 4 most important routes for performance */}
          <circle className="pulse-circle" r="2" fill="white">
            <animateMotion
              path="M250,160 L455,145"
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>
          
          {/* London to Dubai */}
          <circle className="pulse-circle" r="2" fill="white">
            <animateMotion
              path="M455,145 L535,210"
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1s"
            />
          </circle>
          
          {/* Mumbai to Hong Kong */}
          <circle className="pulse-circle" r="2" fill="white">
            <animateMotion
              path="M590,230 L680,230"
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
              begin="2s"
            />
          </circle>
          
          {/* Singapore to Sydney */}
          <circle className="pulse-circle" r="2" fill="white">
            <animateMotion
              path="M650,280 L735,375"
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
              begin="3s"
            />
          </circle>
        </g>
        
        {/* Major financial centers - kept static */}
        <g>
          <circle cx="250" cy="160" r="2.5" fill="white" opacity="0.9" /> {/* New York */}
          <circle cx="455" cy="145" r="2.5" fill="white" opacity="0.9" /> {/* London */}
          <circle cx="480" cy="150" r="2.5" fill="white" opacity="0.9" /> {/* Frankfurt */}
          <circle cx="560" cy="120" r="2.5" fill="white" opacity="0.9" /> {/* Moscow */}
          <circle cx="535" cy="210" r="2.5" fill="white" opacity="0.9" /> {/* Dubai */}
          <circle cx="590" cy="230" r="2.5" fill="white" opacity="0.9" /> {/* Mumbai */}
          <circle cx="680" cy="230" r="2.5" fill="white" opacity="0.9" /> {/* Hong Kong */}
          <circle cx="735" cy="170" r="2.5" fill="white" opacity="0.9" /> {/* Tokyo */}
          <circle cx="650" cy="280" r="2.5" fill="white" opacity="0.9" /> {/* Singapore */}
          <circle cx="735" cy="375" r="2.5" fill="white" opacity="0.9" /> {/* Sydney */}
          <circle cx="230" cy="240" r="2.5" fill="white" opacity="0.9" /> {/* Mexico City */}
          <circle cx="310" cy="370" r="2.5" fill="white" opacity="0.9" /> {/* São Paulo */}
          <circle cx="520" cy="350" r="2.5" fill="white" opacity="0.9" /> {/* Johannesburg */}
        </g>
        
        {/* Subtle overlay to enhance readability of text over the map */}
        <rect x="0" y="0" width="1200" height="600" fill="rgba(0,0,20,0.4)" />
      </svg>
    </div>
  );
});