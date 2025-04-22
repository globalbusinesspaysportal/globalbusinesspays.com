import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { CardItem } from "@/components/ui/card-item";
import { Card3D } from "@/components/ui/card-3d-new";
import { useBNBPrice } from "@/hooks/use-bnb-price";
import { Button } from "@/components/ui/button";
import { NasaWorldMap } from "@/components/ui/nasa-world-map";
import { ArrowDown, ArrowRight, CreditCard, Globe, Shield, Wallet, ExternalLink } from "lucide-react";
// Using direct URL path that works with the public folder
const logoDarkUrl = "/LOGO_NN1.png";

type Card = {
  id: number;
  name: string;
  description: string;
  priceBNB: number;
  imageUrl: string;
  priceUSD: number;
};

export default function Home() {
  const { isLoading: isBNBPriceLoading, calculateUSD } = useBNBPrice();
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const { data: cards, isLoading: isCardsLoading } = useQuery<Card[]>({
    queryKey: ['/api/cards'],
  });
  
  const isLoading = isCardsLoading || isBNBPriceLoading;

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section with World Map Background */}
      <section className="relative py-20 md:py-32 flex items-center overflow-hidden">
        {/* Solid background to ensure map is clearly visible */}
        <div className="absolute inset-0 bg-slate-950"></div>
        
        {/* NASA-Inspired World Map Background - Optimized and memoized */}
        <NasaWorldMap />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            {/* Professional title with reduced animations */}
            <div className="mb-3">
              <div>
                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-8 text-white leading-tight relative">
                  <span className="relative inline-block">
                    Exclusive
                  </span>{" "}
                  <span className="relative z-10 inline-block glass-effect px-2 py-1 rounded-md bg-slate-900/50">
                    Visa Cards
                  </span>{" "}
                  for{" "}
                  <span className="text-transparent bg-clip-text relative inline-block"
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #a855f7)',
                          backgroundSize: '100% auto'
                        }}>
                    Global Business
                  </span>{" "}
                  <span className="inline-block">
                    Professionals
                  </span>
                </h1>
              </div>
            </div>
            
            {/* Subtitle - simplified to reduce rendering load */}
            <div className="mb-8 relative">
              <div>
                <p className="text-lg text-slate-200 max-w-3xl mx-auto relative z-10 glass-effect bg-slate-900/20 p-4 rounded-lg">
                  Our premium Visa cards offer <span className="font-semibold text-primary">unparalleled financial flexibility</span>, 
                  <span className="font-semibold text-primary"> travel benefits</span>, and 
                  <span className="font-semibold text-primary"> exclusive privileges</span> for global entrepreneurs and business professionals.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              {/* Static glow effect instead of animated */}
              <div className="absolute inset-0 bg-primary/10 filter blur-xl rounded-full opacity-70"></div>
              
              {/* Button with hover animation */}
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground py-6 px-8 text-lg relative z-10 
                           transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                asChild
              >
                <a href="/cards">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Select Your Card
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 text-white hover:bg-slate-800 py-6 px-8 text-lg relative z-10
                           transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                asChild
              >
                <a href="/benefits">
                  <Wallet className="mr-2 h-5 w-5" />
                  View Benefits
                </a>
              </Button>
              
              <Button 
                variant="secondary" 
                className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 py-6 px-8 text-lg relative z-10
                           transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                asChild
              >
                <a href="https://globalbusinesspays.com/index.html" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Exit Portal
                </a>
              </Button>
            </div>
          </div>
          
          {/* Animated scroll arrow */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              onClick={scrollToCards}
              className="text-slate-400 hover:text-primary animate-bounce"
            >
              <ArrowDown className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with Professional Animations */}
      <section className="py-24 relative overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-gradient"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(29,78,216,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(29,78,216,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        
        {/* Dynamic particle effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full glass-effect bg-gradient-to-br from-primary/5 to-transparent animate-float-slow" style={{animationDelay: '1.2s'}}></div>
          <div className="absolute bottom-1/3 right-20 w-64 h-64 rounded-full glass-effect bg-gradient-to-tr from-primary/5 to-transparent animate-float-slow" style={{animationDelay: '0.5s'}}></div>
          
          {/* Moving light beams */}
          <div className="absolute top-0 left-1/3 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-30 transform rotate-45 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/3 w-full h-full bg-gradient-to-t from-primary/5 to-transparent opacity-30 transform -rotate-45 animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title with Animated Underline */}
          <div className="text-center mb-20 overflow-hidden relative">
            <div className="glass-effect py-6 px-8 rounded-2xl inline-block mb-6 bg-slate-900/30 backdrop-blur-lg">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white relative inline-block">
                Why Choose <span className="text-transparent bg-clip-text"
                              style={{
                                backgroundImage: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #4f46e5)',
                                backgroundSize: '200% auto',
                                animation: 'shine 3s linear infinite'
                              }}>GlobalBusinessPay</span> Visa Cards portal?
                
                {/* Animated underline */}
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse-slow"></span>
              </h2>
            </div>
            
            <p className="text-lg text-slate-300 max-w-3xl mx-auto glass-effect py-3 px-6 rounded-xl bg-slate-950/20">
              Our exclusive visa card portal is designed to meet the financial needs 
              of international business professionals and entrepreneurs.
            </p>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 -left-10 w-20 h-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full"></div>
            <div className="absolute top-1/2 -right-10 w-20 h-1 bg-gradient-to-l from-primary/50 to-transparent rounded-full"></div>
          </div>
          
          {/* Feature Cards with Enhanced Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-container">
            {/* Feature Card 1 - Global Acceptance */}
            <div className="group relative">
              {/* Card glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-700 rounded-xl"></div>
              
              <div className="glass-effect bg-slate-900/60 p-8 rounded-xl border border-slate-700/50 relative z-10
                           transition-all duration-500 hover:transform hover:translate-y-[-10px] group-hover:border-primary/40
                           hover:shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.5)]"
                   style={{animation: 'float 8s ease-in-out infinite', animationDelay: '0.1s'}}>
                
                {/* Icon with animation */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 p-0.5 mb-6 relative overflow-hidden group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow"></div>
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center relative">
                    <Globe className="text-primary h-8 w-8 transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">Global Acceptance</h3>
                <p className="text-slate-300">
                  Use your card anywhere in the world with universal acceptance at millions of merchants worldwide.
                </p>
                
                {/* Animated arrow on hover */}
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature Card 2 - Premium Benefits */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-700 rounded-xl"></div>
              
              <div className="glass-effect bg-slate-900/60 p-8 rounded-xl border border-slate-700/50 relative z-10
                           transition-all duration-500 hover:transform hover:translate-y-[-10px] group-hover:border-primary/40
                           hover:shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.5)]"
                   style={{animation: 'float 8s ease-in-out infinite', animationDelay: '0.3s'}}>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 p-0.5 mb-6 relative overflow-hidden group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow"></div>
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center relative">
                    <CreditCard className="text-primary h-8 w-8 transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">Premium Benefits</h3>
                <p className="text-slate-300">
                  Enjoy exclusive perks, rewards, and premium services tailored to your specific card tier.
                </p>
                
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            {/* Feature Card 3 - Secure Transactions */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-700 rounded-xl"></div>
              
              <div className="glass-effect bg-slate-900/60 p-8 rounded-xl border border-slate-700/50 relative z-10
                           transition-all duration-500 hover:transform hover:translate-y-[-10px] group-hover:border-primary/40
                           hover:shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.5)]"
                   style={{animation: 'float 8s ease-in-out infinite', animationDelay: '0.5s'}}>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 p-0.5 mb-6 relative overflow-hidden group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow"></div>
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center relative">
                    <Shield className="text-primary h-8 w-8 transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">Secure Transactions</h3>
                <p className="text-slate-300">
                  Advanced security features protect your finances with state-of-the-art fraud prevention systems.
                </p>
                
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            {/* Feature Card 4 - Affordable Pricing */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-700 rounded-xl"></div>
              
              <div className="glass-effect bg-slate-900/60 p-8 rounded-xl border border-slate-700/50 relative z-10
                           transition-all duration-500 hover:transform hover:translate-y-[-10px] group-hover:border-primary/40
                           hover:shadow-[0_10px_40px_-15px_rgba(var(--primary-rgb),0.5)]"
                   style={{animation: 'float 8s ease-in-out infinite', animationDelay: '0.7s'}}>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 p-0.5 mb-6 relative overflow-hidden group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow"></div>
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center relative">
                    <Wallet className="text-primary h-8 w-8 transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">Affordable Pricing</h3>
                <p className="text-slate-300">
                  Competitive BNB pricing with transparent conversion rates and no hidden fees or charges.
                </p>
                
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Removed BNB Address Section as requested */}

      {/* CTA Section with Professional Animations */}
      <section className="py-24 relative overflow-hidden">
        {/* Advanced gradient background with animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-primary/5 to-slate-950 animate-gradient opacity-90"></div>
        
        {/* Dynamic grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(29,78,216,0.03)_1.5px,transparent_1.5px),linear-gradient(to_right,rgba(29,78,216,0.03)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-20"></div>
        
        {/* Geometric decoration elements */}
        <div className="absolute left-0 top-0 w-full h-full overflow-hidden">
          {/* Large glowing shape */}
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-float" style={{animationDelay: '2s'}}></div>
          
          {/* Decorative light streaks */}
          <div className="absolute top-1/3 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          
          {/* Animated particles */}
          <div className="absolute w-[200px] h-[200px] top-[20%] right-[10%]">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white/60 animate-float-fast" style={{animationDelay: '0.1s'}}></div>
            <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-white/40 animate-float-fast" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-white/50 animate-float-fast" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-white/30 animate-float-fast" style={{animationDelay: '0.7s'}}></div>
          </div>
          
          <div className="absolute w-[200px] h-[200px] bottom-[20%] left-[10%]">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white/60 animate-float-fast" style={{animationDelay: '0.9s'}}></div>
            <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-white/40 animate-float-fast" style={{animationDelay: '1.2s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-white/50 animate-float-fast" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-white/30 animate-float-fast" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
        
        {/* Content with advanced animations */}
        <div className="glass-effect bg-slate-900/30 max-w-4xl mx-auto text-center px-8 py-12 sm:px-12 sm:py-16 rounded-2xl relative z-10 border border-slate-700/50 backdrop-blur-sm
                       transform perspective-container">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-[-2px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 animate-pulse-slow"></div>
          </div>
          
          {/* Heading with advanced animation */}
          <div className="mb-8 overflow-hidden relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-pulse-slow"></div>
            
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 relative inline-block">
              Ready to{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-primary/20 blur-md rounded-lg animate-pulse-slow"></span>
                <span className="text-transparent bg-clip-text relative z-10"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #4f46e5, #8b5cf6, #a855f7, #8b5cf6, #4f46e5)',
                    backgroundSize: '300% auto',
                    animation: 'shine 4s linear infinite'
                  }}>
                  Elevate
                </span>
              </span>{" "}
              Your Business Financial Experience?
              
              {/* Animated underline */}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse-slow"></span>
            </h2>
          </div>
          
          {/* Subtitle with staggered animation */}
          <div className="mb-12 overflow-hidden relative">
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto relative z-10">
              Join thousands of global entrepreneurs who trust 
              <span className="font-semibold text-black"> GlobalBusinessPay </span> 
              for their premium Visa card solutions.
            </p>
            
            {/* Decorative element */}
            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse-slow"></div>
          </div>
          
          {/* Reference point for scroll */}
          <div ref={cardsRef}></div>
          
          {/* Button with advanced effects */}
          <div className="relative inline-block group mt-8">
            {/* Multi-layered glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow group-hover:bg-primary/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 bg-primary/10 blur-md rounded-full animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
            
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ripple"></div>
            
            <Button 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-6 px-10 text-lg relative z-10
                       transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] rounded-full"
              asChild
            >
              <a href="/cards" className="flex items-center">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 animate-shine"></span>
                <CreditCard className="mr-3 h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold tracking-wide">View All Premium Cards</span>
              </a>
            </Button>
            
            {/* Decorative dot below button */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-primary/50 blur-sm animate-pulse-slow"></div>
          </div>
        </div>
      </section>
    </>
  );
}
