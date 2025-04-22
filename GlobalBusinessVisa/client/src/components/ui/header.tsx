import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoUrl = "/LOGO_NN1.png"; // Using the new GBP logo from the public folder

  // Close mobile menu on window resize (if width increases to desktop size)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    // Detect scroll to add shadow effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 bg-slate-900 border-b border-primary transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2 md:mr-4">
                  <img 
                    src={logoUrl}
                    alt="Global Business Pay Logo" 
                    className="h-9 md:h-12 w-auto object-contain transition-all duration-300"
                  />
                </div>
                <span className="font-heading font-bold text-white text-sm md:text-xl tracking-tight whitespace-nowrap">
                  Global Business Pay
                </span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 justify-end">
            <Link href="/">
              <span className="text-white hover:text-orange-400 font-medium transition-colors duration-200">
                Home
              </span>
            </Link>
            <Link href="/cards">
              <span className="text-white hover:text-orange-400 font-medium transition-colors duration-200">
                Cards
              </span>
            </Link>
            <Link href="/benefits">
              <span className="text-white hover:text-orange-400 font-medium transition-colors duration-200">
                Benefits
              </span>
            </Link>
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-orange-600/80"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 shadow-lg absolute w-full border-b border-primary/30 transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-0 sm:px-3">
            <Link href="/">
              <span className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-orange-600/80 transition-colors duration-200">
                Home
              </span>
            </Link>
            <Link href="/cards">
              <span className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-orange-600/80 transition-colors duration-200">
                Cards
              </span>
            </Link>
            <Link href="/benefits">
              <span className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-orange-600/80 transition-colors duration-200">
                Benefits
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
