import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CreditCard } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface CardItemProps {
  id: number;
  name: string;
  priceBNB: number;
  priceUSD: number;
  imageUrl: string;
  hideTitle?: boolean;
  hideLabel?: boolean;
  enable3D?: boolean;
}

export function CardItem({ 
  id, 
  name, 
  priceBNB, 
  priceUSD, 
  imageUrl, 
  hideTitle = false,
  hideLabel = false,
  enable3D = false
}: CardItemProps) {
  // Extract card type from name
  const cardType = name.replace(' Visa', '');
  
  // For 3D effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);
  
  // Set up periodic shaking animation
  useEffect(() => {
    if (enable3D) {
      const shakeInterval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1000);
      }, 5000);
      
      return () => clearInterval(shakeInterval);
    }
  }, [enable3D]);
  
  // 3D hover effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enable3D) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation (limited to 10 degrees)
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10;
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 10;
    
    // Calculate glow position
    const glowX = ((mouseX - rect.left) / rect.width) * 100;
    const glowY = ((mouseY - rect.top) / rect.height) * 100;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
    setGlowPosition({ x: glowX, y: glowY });
  };
  
  const handleMouseLeave = () => {
    if (!enable3D) return;
    setRotateX(0);
    setRotateY(0);
  };
  
  // Set up the card style based on 3D state
  const cardStyle = enable3D ? {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isShaking ? 'translateX(3px) translateY(-2px)' : ''}`,
    transition: isShaking ? 'transform 0.1s ease' : 'transform 0.2s ease',
    boxShadow: `
      0 10px 30px -10px rgba(0, 0, 0, 0.5),
      inset 0 0 20px rgba(255, 255, 255, 0.1),
      0 0 0 0.5px rgba(255, 255, 255, 0.1)
    `,
    background: `
      radial-gradient(
        circle at ${glowPosition.x}% ${glowPosition.y}%, 
        rgba(var(--primary-rgb), 0.2) 0%, 
        rgba(0, 0, 0, 0) 70%
      ),
      linear-gradient(120deg, rgba(45, 45, 60, 1) 0%, rgba(25, 25, 35, 1) 100%)
    `
  } : {};
  
  const contentStyle = enable3D ? {
    background: 'transparent',
    position: 'relative',
    zIndex: 2
  } as React.CSSProperties : {};
  
  return (
    <Card 
      ref={cardRef}
      className={`rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border ${enable3D ? 'border-slate-700 hover:border-primary/50' : 'bg-slate-900 border-slate-800 hover:border-primary/50'}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" style={enable3D ? { filter: 'brightness(0.95)' } : {}} />
        {!hideLabel && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 rounded-md text-xs text-primary font-medium flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{cardType}</span>
          </div>
        )}
      </div>
      <CardContent className="p-6" style={contentStyle}>
        {/* Always show card name (even if hideTitle is true) */}
        <h3 className={`text-xl font-heading font-semibold text-white ${!hideTitle ? 'mb-2 leading-tight min-h-[3.5rem]' : 'text-center mb-4'}`}>
          {name}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-primary text-lg">{priceBNB} BNB</span>
          <span className="text-slate-400 text-sm">≈ ${priceUSD.toFixed(2)}</span>
        </div>
        <Link href={`/card/${id}`}>
          <div className={`w-full py-3 px-4 ${enable3D ? 'bg-primary/90 hover:bg-primary' : 'bg-primary hover:bg-primary/90'} text-primary-foreground font-medium rounded-md transition-colors duration-200 inline-block text-center cursor-pointer`}>
            Select Card
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
