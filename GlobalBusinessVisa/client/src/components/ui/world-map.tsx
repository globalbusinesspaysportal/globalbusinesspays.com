import React, { useEffect, useState, useRef, useMemo } from 'react';

// Optimized world map component to eliminate flickering and improve performance
export const WorldMap = () => {
  // Use refs to avoid unnecessary re-renders
  const requestRef = useRef<number>();
  const connectionsRef = useRef<{start: [number, number], end: [number, number], progress: number, duration: number}[]>([]);
  
  // State used only to trigger re-renders
  const [animationCounter, setAnimationCounter] = useState(0);
  
  // Pre-define the financial nodes to avoid recreating on each render
  const nodes = useMemo(() => [
    [145, 125] as [number, number], // New York
    [285, 105] as [number, number], // London
    [300, 110] as [number, number], // Frankfurt
    [340, 125] as [number, number], // Moscow
    [450, 180] as [number, number], // Dubai
    [490, 165] as [number, number], // Mumbai
    [535, 135] as [number, number], // Shanghai
    [555, 130] as [number, number], // Tokyo
    [195, 148] as [number, number], // Mexico City
    [210, 235] as [number, number], // São Paulo
    [380, 200] as [number, number], // Johannesburg
    [550, 230] as [number, number], // Sydney
    [320, 170] as [number, number], // Cairo
    [520, 190] as [number, number], // Singapore
  ], []);
  
  // Function to create a new connection (static function to prevent recreation)
  const createNewConnection = (nodeList: [number, number][]) => {
    const startIndex = Math.floor(Math.random() * nodeList.length);
    let endIndex;
    do {
      endIndex = Math.floor(Math.random() * nodeList.length);
    } while (endIndex === startIndex); // Ensure different start and end points
    
    return {
      start: nodeList[startIndex],
      end: nodeList[endIndex],
      progress: 0,
      duration: 4 + Math.random() * 3 // Between 4-7 seconds (slower to reduce performance impact)
    };
  };
  
  // Optimize animation by using requestAnimationFrame directly
  useEffect(() => {
    // Create initial connections if they don't exist
    if (connectionsRef.current.length === 0) {
      // Type assertion to ensure TypeScript understands the tuple structure
      connectionsRef.current = Array(8).fill(0).map(() => createNewConnection(nodes as [number, number][]));
    }
    
    // Keep track of the last render time for smooth animation
    let lastRenderTime = performance.now();
    
    // Animation function that minimizes React's involvement
    const animate = (time: number) => {
      // Calculate elapsed time since last frame
      const deltaTime = time - lastRenderTime;
      lastRenderTime = time;
      
      // Only update every 40ms (approx 25fps) to reduce strain on rendering
      if (deltaTime > 40) {
        let needsUpdate = false;
        
        // Update all connections
        connectionsRef.current = connectionsRef.current.map(conn => {
          // Update progress based on actual elapsed time
          const newProgress = conn.progress + (deltaTime / (conn.duration * 1000));
          
          // If connection completed, create a new one
          if (newProgress >= 1) {
            needsUpdate = true;
            return createNewConnection(nodes as [number, number][]);
          }
          
          // Otherwise update progress
          needsUpdate = needsUpdate || Math.floor(conn.progress * 100) !== Math.floor(newProgress * 100);
          return { ...conn, progress: newProgress };
        });
        
        // Only trigger re-render if needed (connections are updated visibly)
        if (needsUpdate) {
          setAnimationCounter(prev => prev + 1);
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [nodes]); // Only re-run if nodes change (never in our case)
  
  // Pre-render the map paths for better performance
  const mapPaths = useMemo(() => (
    <g fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.7">
      {/* North America */}
      <path d="M60,80 C65,65 75,55 90,40 C105,25 120,20 135,28 C150,35 165,35 180,40 C195,45 205,55 215,60 C225,65 235,75 230,90 C225,105 215,115 200,125 C185,135 175,145 165,160 C155,175 145,190 130,195 C115,200 100,190 85,180 C70,170 60,160 50,145 C40,130 40,120 45,105 C50,90 55,95 60,80 Z" />
      
      {/* Central America */}
      <path d="M130,195 C140,190 150,185 160,175 C170,165 175,155 185,150 C195,145 200,150 205,160 C210,170 215,180 205,190 C195,200 185,210 175,215 C165,220 155,225 145,215 C135,205 125,195 130,195 Z" />
      
      {/* South America */}
      <path d="M175,215 C185,210 195,205 205,210 C215,215 225,225 235,235 C245,245 245,255 240,270 C235,285 230,300 220,315 C210,330 195,340 180,335 C165,330 155,320 150,305 C145,290 145,275 150,260 C155,245 165,220 175,215 Z" />
      
      {/* Europe */}
      <path d="M270,80 C280,75 290,70 305,70 C320,70 335,75 350,85 C365,95 370,105 365,115 C360,125 350,130 340,135 C330,140 320,145 310,140 C300,135 290,130 285,120 C280,110 275,105 270,95 C265,85 260,85 270,80 Z" />
      
      {/* UK and Ireland */}
      <path d="M260,90 C265,85 270,80 275,85 C280,90 285,95 280,100 C275,105 270,110 265,105 C260,100 255,95 260,90 Z" />
      
      {/* Africa */}
      <path d="M300,140 C310,135 320,130 330,135 C340,140 355,145 365,155 C375,165 385,180 390,195 C395,210 395,225 385,240 C375,255 360,265 345,270 C330,275 315,275 300,265 C285,255 275,240 270,225 C265,210 270,195 280,180 C290,165 290,145 300,140 Z" />
      
      {/* Russia and Northern Asia */}
      <path d="M350,85 C365,80 380,75 395,70 C410,65 425,60 440,65 C455,70 470,80 485,95 C500,110 510,125 505,140 C500,155 490,165 475,170 C460,175 445,175 430,170 C415,165 400,160 390,145 C380,130 365,115 350,100 C335,85 335,90 350,85 Z" />
      
      {/* Middle East */}
      <path d="M340,135 C350,130 360,130 370,135 C380,140 390,150 395,160 C400,170 400,180 390,185 C380,190 370,190 360,185 C350,180 345,170 340,160 C335,150 330,140 340,135 Z" />
      
      {/* India */}
      <path d="M420,155 C430,150 440,150 450,155 C460,160 470,170 475,180 C480,190 480,200 470,205 C460,210 450,210 440,205 C430,200 425,190 420,180 C415,170 410,160 420,155 Z" />
      
      {/* China */}
      <path d="M440,120 C450,115 460,110 475,115 C490,120 505,130 515,140 C525,150 530,160 520,170 C510,180 495,185 480,180 C465,175 455,165 445,155 C435,145 430,125 440,120 Z" />
      
      {/* Southeast Asia */}
      <path d="M480,180 C490,175 500,175 510,180 C520,185 525,195 525,205 C525,215 520,225 510,225 C500,225 490,220 485,210 C480,200 480,190 480,180 Z" />
      
      {/* Japan */}
      <path d="M540,120 C545,115 550,115 555,120 C560,125 565,130 560,135 C555,140 550,145 545,140 C540,135 535,125 540,120 Z" />
      
      {/* Indonesia */}
      <path d="M490,210 C500,205 510,205 520,210 C530,215 535,225 535,235 C535,245 530,250 520,250 C510,250 500,245 495,235 C490,225 485,220 490,210 Z" />
      
      {/* Australia */}
      <path d="M525,245 C535,240 545,240 555,245 C565,250 575,260 575,275 C575,290 570,300 560,305 C550,310 540,305 530,295 C520,285 515,275 520,265 C525,255 515,250 525,245 Z" />
      
      {/* Greenland */}
      <path d="M210,45 C220,40 230,35 245,40 C260,45 270,55 270,65 C270,75 260,80 245,75 C230,70 220,65 215,55 C210,45 200,50 210,45 Z" />
      
      {/* Antarctica - just a partial outline at the bottom */}
      <path d="M100,380 C150,375 200,370 250,370 C300,370 350,375 400,375 C450,375 500,370 550,375 C600,380 650,385 700,385" />
      
      {/* Island chains and smaller landmass outlines */}
      <path d="M490,230 C495,225 500,225 505,230 C510,235 515,240 510,245 C505,250 500,250 495,245 C490,240 485,235 490,230 Z" /> {/* Philippines */}
      <path d="M580,255 C585,250 590,250 595,255 C600,260 600,265 595,270 C590,275 585,275 580,270 C575,265 575,260 580,255 Z" /> {/* New Zealand */}
      <path d="M370,210 C375,205 380,205 385,210 C390,215 390,220 385,225 C380,230 375,230 370,225 C365,220 365,215 370,210 Z" /> {/* Madagascar */}
    </g>
  ), []);
  
  // Pre-render activity hotspots for better performance
  const activityHotspots = useMemo(() => (
    <>
      <circle cx="145" cy="125" r="2" fill="white" opacity="0.5" /> {/* New York */}
      <circle cx="285" cy="105" r="2" fill="white" opacity="0.5" /> {/* London */}
      <circle cx="300" cy="110" r="1.5" fill="white" opacity="0.5" /> {/* Frankfurt */}
      <circle cx="535" cy="135" r="2" fill="white" opacity="0.5" /> {/* Shanghai */}
      <circle cx="555" cy="130" r="1.5" fill="white" opacity="0.5" /> {/* Tokyo */}
      <circle cx="490" cy="165" r="1.5" fill="white" opacity="0.5" /> {/* Mumbai */}
      <circle cx="520" cy="190" r="1.5" fill="white" opacity="0.5" /> {/* Singapore */}
      <circle cx="450" cy="180" r="1.5" fill="white" opacity="0.5" /> {/* Dubai */}
      <circle cx="550" cy="230" r="1.5" fill="white" opacity="0.5" /> {/* Sydney */}
    </>
  ), []);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        style={{ willChange: 'transform' }} // Performance hint for browser
      >
        {/* Reusable elements - pre-rendered */}
        {mapPaths}
        
        {/* Connection Lines - only part that changes */}
        {connectionsRef.current.map((conn, index) => {
          // Calculate the current point along the line based on progress
          const currentX = conn.start[0] + (conn.end[0] - conn.start[0]) * conn.progress;
          const currentY = conn.start[1] + (conn.end[1] - conn.start[1]) * conn.progress;
          
          return (
            <g key={index}>
              {/* Base connection line */}
              <line
                x1={conn.start[0]}
                y1={conn.start[1]}
                x2={conn.end[0]}
                y2={conn.end[1]}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="0.7"
                strokeDasharray="3,3"
              />
              
              {/* Animated pulse moving along the line */}
              <line
                x1={conn.start[0]}
                y1={conn.start[1]}
                x2={currentX}
                y2={currentY}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
              />
              
              {/* Pulse dot at the current position */}
              <circle
                cx={currentX}
                cy={currentY}
                r="1.5"
                fill="white"
                opacity="0.6"
              />
            </g>
          );
        })}
        
        {/* Activity Hotspots - pre-rendered */}
        {activityHotspots}
      </svg>
    </div>
  );
};