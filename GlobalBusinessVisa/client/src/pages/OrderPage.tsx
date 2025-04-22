import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useBNBPrice } from "@/hooks/use-bnb-price";
import { CryptoAddress } from "@/components/ui/crypto-address";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Card3D } from "@/components/ui/card-3d-new";
import { Card as CardType, Cryptocurrency } from "@shared/schema";

// Define a type that extends the Card type to include a record of crypto prices
type CardWithCryptoPrices = CardType & {
  cryptoPrices: Record<string, number>;
};
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const orderSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  accountNumber: z.string().min(1, "Account number is required"),
  gbpId: z.string().optional(), // Make gbpId completely optional
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrderPage() {
  const [match, params] = useRoute("/card/:id");
  const [, navigate] = useLocation();
  const cardId = match ? params.id : "-1";
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch card data
  const { data: card, isLoading } = useQuery<CardWithCryptoPrices>({
    queryKey: [`/api/cards/${cardId}`],
    enabled: cardId !== "-1",
  });

  // Get BNB price for calculations
  const { bnbPrice, isLoading: isBNBPriceLoading } = useBNBPrice();
  
  // Fetch active cryptocurrencies
  const { data: cryptocurrencies, isLoading: isCryptoLoading } = useQuery<Cryptocurrency[]>({
    queryKey: ["/api/active-cryptocurrencies"],
  });
  
  // Set up state for selected cryptocurrency
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BNB");
  
  // Find the currently selected cryptocurrency
  const activeCrypto = cryptocurrencies?.find(c => c.symbol === selectedCrypto);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fullName: "",
      email: "",
      accountNumber: "",
      // gbpId removed as requested
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/orders", formData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit order");
      }
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: OrderFormData) => {
    if (!card) return;

    // Check if file is selected
    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
      toast({
        title: "Missing Receipt",
        description: "Please upload your payment receipt",
        variant: "destructive",
      });
      return;
    }

    if (!activeCrypto) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment cryptocurrency",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate the crypto amount directly from current prices for consistency
    const cryptoAmount = card.basePrice / activeCrypto.usdPrice;
      
    const formData = new FormData();
    formData.append("cardId", cardId);
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("accountNumber", values.accountNumber);
    // GBP ID is now removed per requirement
    formData.append("receipt", fileInputRef.current.files[0]);
    formData.append("cryptoSymbol", activeCrypto.symbol);
    formData.append("cryptoAmount", cryptoAmount.toString());
    formData.append("cryptoAddress", activeCrypto.address);

    // Log form data for debugging
    console.log("Submitting order with:", {
      cardId,
      fullName: values.fullName,
      email: values.email,
      accountNumber: values.accountNumber,
      cryptoSymbol: activeCrypto.symbol,
      cryptoAmount: cryptoAmount,
      cryptoAddress: activeCrypto.address,
      receipt: fileInputRef.current.files[0].name
    });

    orderMutation.mutate(formData);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (isLoading || isBNBPriceLoading || isCryptoLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
              <p className="mb-6">The card you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/cards")}>
                Return to Cards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full mx-4 text-center border border-primary/30">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-white mb-2">Order Submitted Successfully</h3>
          <p className="text-slate-300 mb-4">Thank you for your purchase!</p>
          <p className="text-slate-300 mb-6">Once your payment is confirmed, your card will be activated within 10 hours.</p>
          <Button onClick={handleReturnHome} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="w-full">
        <nav className="mb-4 md:mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-1">
            <li>
              <a href="/" className="text-slate-400 hover:text-primary text-sm">Home</a>
            </li>
            <li className="flex items-center">
              <span className="mx-1 text-slate-600">/</span>
              <a href="/cards" className="text-slate-400 hover:text-primary text-sm">Cards</a>
            </li>
            <li className="flex items-center">
              <span className="mx-1 text-slate-600">/</span>
              <span className="text-primary text-sm">{card.name}</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First section: Card Display */}
          <div className="w-full">
            <div className="perspective-3d w-full">
              <div className="animate-float-fast card-flash-border">
                <Card3D
                  id={card.id}
                  name={card.name}
                  priceBNB={parseFloat((card.basePrice / (bnbPrice || 550)).toFixed(8))}
                  priceUSD={card.basePrice}
                  imageUrl={card.imageUrl}
                  hideActions={true}
                />
              </div>
            </div>
            
            <div className="mt-4 bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-heading font-semibold text-white">{card.name}</h3>
                <span className="font-bold text-primary text-xl">
                  ${card.basePrice.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-2">{card.description}</p>
              {activeCrypto && (
                <div className="flex flex-col text-slate-400 text-sm space-y-1 mt-2 pt-2 border-t border-slate-700">
                  <div className="text-right font-medium">
                    Price in {activeCrypto.symbol === 'BNB' ? 'BNB Smart Chain (BEP-20)' : activeCrypto.symbol}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CryptoIcon symbol={activeCrypto.symbol} size={18} />
                      <span>Amount to pay:</span>
                    </div>
                    <span className="font-semibold text-lg text-primary">
                      {/* Calculate price directly for consistency */}
                      {(card.basePrice / activeCrypto.usdPrice).toFixed(8)} {activeCrypto.symbol}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Second section: Payment Instructions */}
          <div className="w-full">
            <div className="bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Instructions</h3>
              
              {/* Cryptocurrency Selection */}
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Select Payment Method:</label>
                <Select 
                  value={selectedCrypto}
                  onValueChange={(value) => setSelectedCrypto(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptocurrencies?.filter(c => c.isActive).map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.symbol}>
                        <div className="flex items-center gap-2">
                          <CryptoIcon symbol={crypto.symbol} size={18} />
                          {crypto.name} ({crypto.symbol})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {activeCrypto ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-primary/30">
                    <div className="text-center mb-2">
                      <p className="text-slate-300 text-sm flex items-center justify-center gap-1">
                        Pay with <span className="text-primary font-semibold flex items-center gap-1">
                          <CryptoIcon symbol={activeCrypto.symbol} size={18} />
                          {activeCrypto.symbol === 'BNB' ? 'BNB Smart Chain (BEP-20)' : activeCrypto.name}
                        </span>
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-700 mb-2">
                      <span className="text-slate-300 text-sm">Card Price:</span>
                      <span className="text-white">${card.basePrice.toFixed(2)} USD</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-700 mb-2">
                      <span className="text-slate-300 text-sm">Current Rate:</span>
                      <span className="text-white">1 {activeCrypto.symbol} = ${activeCrypto.usdPrice.toFixed(2)} USD</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 mb-1">
                      <span className="text-white text-sm font-medium">Amount to pay:</span>
                      <span className="text-primary font-bold text-lg">
                        {/* Calculate crypto amount directly from card price and current crypto price */}
                        {(card.basePrice / activeCrypto.usdPrice).toFixed(8)} {activeCrypto.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 text-center mt-1">
                      This is exactly {(card.basePrice / activeCrypto.usdPrice).toFixed(8)} {activeCrypto.symbol} at current rate of ${activeCrypto.usdPrice}
                    </div>
                  </div>
                  
                  <CryptoAddress 
                    address={activeCrypto.address} 
                    symbol={activeCrypto.symbol} 
                  />
                  
                  <div className="text-center bg-slate-800 rounded-md p-3 mt-2">
                    <p className="text-slate-300 text-sm">
                      <span className="text-primary font-semibold">Important:</span> Send only {activeCrypto.symbol} to this address.
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      After payment, upload your receipt in the form below to complete your order.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <Spinner size="lg" />
                  <p className="mt-2 text-slate-400">Loading payment options...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Form Section - Full Width */}
        <div className="mt-8 bg-slate-900 rounded-xl p-4 md:p-6 border border-slate-800">
          <h2 className="text-xl font-heading font-semibold text-white mb-5">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* GBP ID field removed as requested */}

                  <div>
                    <FormLabel htmlFor="receiptUpload">Payment Receipt or Screenshot</FormLabel>
                    <div className="mt-1">
                      <Input 
                        id="receiptUpload" 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*,application/pdf"
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload payment receipt or screenshot (JPG, PNG, PDF)
                    </p>
                  </div>
                </form>
              </Form>
            </div>

            <div className="flex flex-col justify-between">
              <div className="bg-slate-800 rounded-md p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Important Information:</h4>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li>• Please ensure all information is correct</li>
                  <li>• Your card will be activated within 10 hours after payment confirmation</li>
                  <li>• Keep your transaction details safe for future reference</li>
                  <li>• Contact support if you need assistance with your payment</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={form.handleSubmit(handleSubmit)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4"
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" /> Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}