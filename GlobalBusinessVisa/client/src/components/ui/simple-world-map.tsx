import React from 'react';

export const SimpleWorldMap = () => {
  return (
    <div className="fixed inset-0 z-0">
      <svg 
        viewBox="0 0 1440 800" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Map base layer */}
        <g>
          {/* North America */}
          <path d="M170,220 L250,140 L330,140 L370,160 L390,200 L380,250 L340,290 L300,310 L250,320 L200,300 L170,260 L150,220 Z" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Central America */}
          <path d="M250,320 L260,340 L240,370 L220,400 L200,420" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* South America */}
          <path d="M220,400 L240,420 L260,450 L280,500 L270,550 L240,580 L210,590 L180,570 L170,520 L180,470 L200,430" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Europe */}
          <path d="M490,180 L520,170 L560,180 L580,200 L570,220 L540,240 L510,250 L490,240 L480,220 L490,200" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* UK */}
          <path d="M450,190 L460,180 L470,190 L460,200 L450,190" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Africa */}
          <path d="M540,250 L580,270 L600,300 L610,350 L600,400 L570,440 L530,460 L490,450 L470,420 L460,370 L470,320 L490,280 L520,260" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Russia & Asia */}
          <path d="M580,180 L650,150 L720,140 L790,150 L850,170 L900,200 L880,240 L840,260 L780,270 L720,270 L670,250 L630,220 L600,200" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Middle East */}
          <path d="M600,250 L630,240 L650,260 L640,280 L610,290 L590,270" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* India */}
          <path d="M730,270 L750,290 L770,330 L760,360 L730,370 L700,350 L690,320 L700,290" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Southeast Asia */}
          <path d="M780,280 L810,300 L830,330 L820,360 L790,370 L770,350" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* China */}
          <path d="M750,240 L800,230 L850,240 L870,270 L850,300 L810,310 L780,300 L760,280" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Japan */}
          <path d="M900,240 L920,230 L930,250 L920,270 L900,260" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Australia */}
          <path d="M840,420 L880,410 L920,430 L930,460 L910,490 L870,500 L840,480 L830,450" 
                stroke="white" strokeWidth="1.5" fill="none" />
          
          {/* Indonesia */}
          <path d="M820,370 L850,360 L880,370 L860,390 L830,390" 
                stroke="white" strokeWidth="1.5" fill="none" />
        </g>

        {/* Connection lines - Static base */}
        <g className="connection-lines">
          <line x1="250" y1="200" x2="500" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="500" y1="200" x2="750" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="750" y1="250" x2="850" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="500" y1="200" x2="550" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="250" y1="200" x2="250" y2="350" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="720" y1="320" x2="550" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="720" y1="320" x2="850" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="250" y1="350" x2="550" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="850" y1="250" x2="900" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="250" y1="200" x2="450" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="450" y1="190" x2="500" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="720" y1="320" x2="850" y2="430" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </g>
        
        {/* Animated connection pulses */}
        <g>
          {/* NY to London */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M250,200 L450,190"
              dur="3s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>
          
          {/* London to Frankfurt */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M450,190 L500,200"
              dur="2s"
              repeatCount="indefinite"
              rotate="auto"
              begin="0.5s"
            />
          </circle>
          
          {/* Frankfurt to Moscow */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M500,200 L600,200"
              dur="2.5s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1s"
            />
          </circle>
          
          {/* Frankfurt to Dubai */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M500,200 L610,290"
              dur="3.5s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1.5s"
            />
          </circle>
          
          {/* Dubai to Mumbai */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M610,290 L730,350"
              dur="2.8s"
              repeatCount="indefinite"
              rotate="auto"
              begin="2s"
            />
          </circle>
          
          {/* Mumbai to Singapore */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M730,350 L820,370"
              dur="2.2s"
              repeatCount="indefinite"
              rotate="auto"
              begin="0.7s"
            />
          </circle>
          
          {/* Singapore to Shanghai */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M820,370 L810,300"
              dur="2.5s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1.1s"
            />
          </circle>
          
          {/* Shanghai to Tokyo */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M810,300 L920,250"
              dur="2s"
              repeatCount="indefinite"
              rotate="auto"
              begin="0.3s"
            />
          </circle>
          
          {/* New York to Mexico City */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M250,200 L240,370"
              dur="3.2s"
              repeatCount="indefinite"
              rotate="auto"
              begin="2.2s"
            />
          </circle>
          
          {/* Mexico City to Sao Paulo */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M240,370 L210,520"
              dur="3.8s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1.8s"
            />
          </circle>
          
          {/* Frankfurt to Johannesburg */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M500,200 L570,440"
              dur="4s"
              repeatCount="indefinite"
              rotate="auto"
              begin="0.9s"
            />
          </circle>
          
          {/* Singapore to Sydney */}
          <circle className="pulse-circle" r="3" fill="white">
            <animateMotion
              path="M820,370 L880,460"
              dur="3.5s"
              repeatCount="indefinite"
              rotate="auto"
              begin="1.3s"
            />
          </circle>
        </g>
        
        {/* Financial center dots */}
        <g>
          <circle cx="250" cy="200" r="3" fill="white" opacity="0.8" /> {/* New York */}
          <circle cx="450" cy="190" r="3" fill="white" opacity="0.8" /> {/* London */}
          <circle cx="500" cy="200" r="3" fill="white" opacity="0.8" /> {/* Frankfurt */}
          <circle cx="600" cy="200" r="3" fill="white" opacity="0.8" /> {/* Moscow */}
          <circle cx="610" cy="290" r="3" fill="white" opacity="0.8" /> {/* Dubai */}
          <circle cx="730" cy="350" r="3" fill="white" opacity="0.8" /> {/* Mumbai */}
          <circle cx="810" cy="300" r="3" fill="white" opacity="0.8" /> {/* Shanghai */}
          <circle cx="920" cy="250" r="3" fill="white" opacity="0.8" /> {/* Tokyo */}
          <circle cx="240" cy="370" r="3" fill="white" opacity="0.8" /> {/* Mexico City */}
          <circle cx="210" cy="520" r="3" fill="white" opacity="0.8" /> {/* Sao Paulo */}
          <circle cx="570" cy="440" r="3" fill="white" opacity="0.8" /> {/* Johannesburg */}
          <circle cx="880" cy="460" r="3" fill="white" opacity="0.8" /> {/* Sydney */}
          <circle cx="820" cy="370" r="3" fill="white" opacity="0.8" /> {/* Singapore */}
        </g>
      </svg>
      
      {/* CSS for pulsing effects included in the page's style */}
    </div>
  );
};