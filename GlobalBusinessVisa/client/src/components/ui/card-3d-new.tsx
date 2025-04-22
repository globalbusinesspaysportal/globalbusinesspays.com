import { useState, useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, CheckCircle } from "lucide-react";

interface Card3DProps {
  id: number;
  name: string;
  priceBNB: number;
  priceUSD: number;
  imageUrl: string;
  hideActions?: boolean;
}

export function Card3D({ 
  id, 
  name, 
  priceBNB, 
  priceUSD, 
  imageUrl,
  hideActions = false
}: Card3DProps) {
  // State for 3D rotation
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse movement handling for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation (limited to 15 degrees)
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 15;
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 15;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  // Flip the card
  const flipCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  // Base rotation from mouse + flip rotation
  const totalRotateY = rotateY + (isFlipped ? 180 : 0);
  
  // Determine the back card image based on card name
  const getBackCardImage = () => {
    const cardTypeName = name.toLowerCase();
    
    if (cardTypeName.includes("premium")) {
      return "https://i.imgur.com/bNtC7wa.jpg"; // Premium Visa Back
    } else if (cardTypeName.includes("gold")) {
      return "https://i.imgur.com/aoMlWAy.jpg"; // Gold Back
    } else if (cardTypeName.includes("platinum")) {
      return "https://i.imgur.com/6bufEKk.jpg"; // Platinum Visa Back
    } else if (cardTypeName.includes("world elite")) {
      return "https://i.imgur.com/28cJMQj.jpg"; // World Elite Visa Back
    } else if (cardTypeName.includes("world")) {
      return "https://i.imgur.com/kYwELV6.jpg"; // World Visa Back
    } else if (cardTypeName.includes("business")) {
      return "https://i.imgur.com/9Hb6PD6.jpg"; // Business Visa Back
    } else {
      return "https://i.imgur.com/bNtC7wa.jpg"; // Default fallback
    }
  };
  
  return (
    <div className="perspective-3d w-full max-w-md mx-auto">
      <div 
        ref={cardRef}
        className="card-3d w-full aspect-[1.586/1] rounded-xl relative cursor-pointer select-none"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${totalRotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={flipCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Front */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            borderRadius: '12px'
          }}
        >
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover rounded-xl"
            style={{ display: 'block' }}
            onError={(e) => {
              console.log("Error loading image:", imageUrl);
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = "https://via.placeholder.com/400x250?text=Card+Image";
            }}
          />
          
          {/* Flip instruction */}
          <div className="absolute bottom-2 left-2 text-white/50 text-[10px] flex items-center z-10">
            <span>Click to flip</span>
            <ChevronRight className="h-3 w-3"/>
          </div>
        </div>
        
        {/* Card Back */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d',
            borderRadius: '12px'
          }}
        >
          <img 
            src={getBackCardImage()} 
            alt={`${name} Back`} 
            className="w-full h-full object-cover rounded-xl"
            style={{ display: 'block' }}
            onError={(e) => {
              console.log("Error loading back image for:", name);
              e.currentTarget.onerror = null; // Prevent infinite loop
              e.currentTarget.src = "https://via.placeholder.com/400x250?text=Card+Back";
            }}
          />
          
          {/* Flip instruction */}
          <div className="absolute bottom-2 left-2 text-white/50 text-[10px] flex items-center z-10">
            <span>Click to flip</span>
            <ChevronRight className="h-3 w-3"/>
          </div>
        </div>
      </div>
      
      {/* Card Actions */}
      {!hideActions && (
        <div className="mt-6 flex flex-col items-center">
          <div className="text-lg font-medium text-slate-200 mb-3">{name}</div>
          <div className="text-xl text-primary font-bold mb-4">${priceUSD.toFixed(2)}</div>
          <Link href={`/card/${id}`}>
            <div className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors duration-200 inline-block text-center cursor-pointer flex items-center justify-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Select This Card
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}