import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";

type CardRecommendation = {
  recommendedCard: string;
  explanation: string;
};

interface CardRecommendationProps {
  cards: Array<{
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  }>;
}

export function CardRecommendation({ cards }: CardRecommendationProps) {
  const [userNeeds, setUserNeeds] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<CardRecommendation | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNeeds.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/recommend-card', { userNeeds });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendation(data);
      } else {
        throw new Error('Failed to get recommendation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Couldn't generate a recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find the card ID based on the recommendation
  const getRecommendedCardId = (): number | undefined => {
    if (!recommendation) return undefined;
    
    const card = cards.find(card => 
      card.name.toLowerCase().includes(recommendation.recommendedCard.toLowerCase()) ||
      recommendation.recommendedCard.toLowerCase().includes(card.name.toLowerCase())
    );
    
    return card?.id;
  };

  const recommendedCardId = getRecommendedCardId();

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="flex items-center mb-4">
        <Sparkles className="w-6 h-6 mr-2 text-primary" />
        <h3 className="text-xl font-semibold text-white">Find your perfect card</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="userNeeds" className="block text-sm font-medium text-slate-300 mb-1">
            Describe your lifestyle and needs:
          </label>
          <Input
            id="userNeeds"
            value={userNeeds}
            onChange={(e) => setUserNeeds(e.target.value)}
            placeholder="e.g., I travel frequently, need cashback on purchases, and want exclusive lounge access..."
            className="w-full bg-slate-700 border-slate-600 text-white"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !userNeeds.trim()}
        >
          {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Get AI Recommendation
        </Button>
      </form>
      
      {recommendation && (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 animate-fadeIn">
          <h4 className="text-lg font-semibold text-primary mb-2">
            Recommended: {recommendation.recommendedCard}
          </h4>
          <p className="text-slate-300 mb-4 text-sm">{recommendation.explanation}</p>
          
          {recommendedCardId && (
            <Link href={`/card/${recommendedCardId}`}>
              <Button variant="outline" className="w-full">
                View Card Details
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}