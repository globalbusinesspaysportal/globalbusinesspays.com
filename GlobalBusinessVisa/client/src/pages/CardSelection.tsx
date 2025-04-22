import { useQuery } from "@tanstack/react-query";
import { Card } from "@shared/schema";
import { CardItem } from "@/components/ui/card-item";
import { Card3D } from "@/components/ui/card-3d-new";
import { useBNBPrice } from "@/hooks/use-bnb-price";
import { Link } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { BNBAddress } from "@/components/ui/bnb-address";

// Define a type that extends the Card type to include a record of crypto prices
type CardWithCryptoPrices = Card & {
  cryptoPrices: Record<string, number>;
};

export default function CardSelection() {
  const { data: cards, isLoading } = useQuery<CardWithCryptoPrices[]>({
    queryKey: ["/api/cards"],
  });
  
  const { bnbPrice, isLoading: isBNBPriceLoading } = useBNBPrice();
  
  if (isLoading || isBNBPriceLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto flex-grow py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">Select Your VISA Card</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer the most affordable VISA cards on the market. Choose the perfect card that matches your needs and budget.
              All payments are processed securely for maximum security.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {cards?.map((card) => (
              <div key={card.id} className="transition-all duration-300 hover:z-10 relative">
                <Card3D
                  id={card.id}
                  name={card.name}
                  priceBNB={card.cryptoPrices?.BNB || parseFloat((card.basePrice / (bnbPrice || 1)).toFixed(8))}
                  priceUSD={card.basePrice}
                  imageUrl={card.imageUrl}
                />
              </div>
            ))}
          </div>
          
          {/* Removed BNB Address Section as requested */}
          
          <div className="bg-slate-800 rounded-lg p-8 max-w-3xl mx-auto border border-slate-700 shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">Important Information</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Once payment is confirmed, your card will be activated within 10 hours</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>You must provide your account information during checkout</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Transaction details will be needed to verify your payment</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Our cards offer the most competitive pricing in the market</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>All transactions are secure and confidential</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}