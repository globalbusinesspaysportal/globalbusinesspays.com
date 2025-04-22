import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type BNBAddressProps = {
  address: string;
  className?: string;
};

export function BNBAddress({ address, className = "" }: BNBAddressProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Format address to show first and last characters with ellipsis in the middle for mobile
  const formatAddress = (addr: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return `${addr.substring(0, 10)}...${addr.substring(addr.length - 10)}`;
    }
    return addr;
  };

  return (
    <div className={`payment-address-container relative rounded-md shadow-sm ${className}`}>
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">Payment Address</h3>
      </div>
      
      <div className="relative">
        <div 
          className="flex items-center bg-slate-800 border border-slate-700 p-3 rounded-md cursor-pointer hover:bg-slate-800/80 transition-colors duration-150"
          onClick={copyToClipboard}
        >
          <code className="text-white font-mono text-sm overflow-x-auto whitespace-nowrap flex-1 mr-2">
            {formatAddress(address)}
          </code>
          {copied ? 
            <Check className="h-5 w-5 text-green-500 mr-1" /> : 
            <Copy className="h-5 w-5 text-slate-400 mr-1" />
          }
        </div>
        
        {/* Touch indication */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-700 text-[10px] px-2 py-0.5 rounded-full text-slate-300 flex items-center gap-0.5">
          <span>Tap to copy</span>
        </div>
      </div>
      
      {/* Success animation */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-md w-full h-full flex items-center justify-center">
            <Check className="h-10 w-10 text-green-500 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}