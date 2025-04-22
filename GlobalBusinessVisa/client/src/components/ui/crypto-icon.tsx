import React from 'react';
import { Bitcoin, DollarSign } from 'lucide-react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function CryptoIcon({ symbol, size = 24, className }: CryptoIconProps) {
  switch (symbol.toUpperCase()) {
    case 'BTC':
      return <Bitcoin size={size} className={`text-yellow-500 ${className}`} />;
    case 'ETH':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 32 32" 
          className={`text-purple-400 ${className}`}
        >
          <path 
            fill="currentColor" 
            d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16zm7.994-15.781L16.498 4 9 16.22l7.498 4.353 7.496-4.354zM16.498 21.968L9 17.616l7.498 10.379 7.496-10.379-7.496 4.353z"
          />
        </svg>
      );
    case 'BNB':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 32 32" 
          className={`text-yellow-400 ${className}`}
        >
          <path 
            fill="currentColor" 
            d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16zm-3.884-17.596L16 10.52l3.886 3.886l2.26-2.26L16 6l-6.144 6.144l2.26 2.26zM6 16l2.26 2.26L10.52 16l-2.26-2.26L6 16zm6.116 1.596l-2.263 2.257l.003.003L16 26l6.146-6.146v-.001l-2.26-2.26L16 21.48l-3.884-3.884zM21.48 16l2.26 2.26L26 16l-2.26-2.26L21.48 16zm-3.188-.002h.001L16 13.706L14.305 15.4l-.195.195l-.401.402l-.004.003l.004.003l2.29 2.291l2.294-2.293l.001-.001l-.002-.002z"
          />
        </svg>
      );
    case 'TRX':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 32 32" 
          className={`text-red-500 ${className}`}
        >
          <path 
            fill="currentColor" 
            d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm7.375 7h-14.75l7.375 8.5zm1.821 1.54l-6.925 16.087 9.38-9.044zm-16.197-.308L8.324 24.16l7.354-15.828zM10.33 23.75H20.5L15.5 13.5z"
          />
        </svg>
      );
    case 'USD':
      return <DollarSign size={size} className={`text-green-500 ${className}`} />;
    default:
      return <span className={`text-gray-500 ${className}`}>{symbol.toUpperCase()}</span>;
  }
}