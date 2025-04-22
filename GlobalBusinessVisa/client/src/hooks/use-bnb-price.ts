import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function useBNBPrice() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/bnb-price'],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Calculate USD value from BNB amount
  const calculateUSD = (bnbAmount: number): number => {
    if (!data || !data.price) return 0;
    return bnbAmount * data.price;
  };

  return {
    bnbPrice: data?.price || 0,
    lastUpdated: data?.lastUpdated ? new Date(data.lastUpdated) : null,
    isLoading,
    error,
    refetch,
    calculateUSD,
  };
}
