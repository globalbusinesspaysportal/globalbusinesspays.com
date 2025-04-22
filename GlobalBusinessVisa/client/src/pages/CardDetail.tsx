import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBNBPrice } from "@/hooks/use-bnb-price";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { BNBAddress } from "@/components/ui/bnb-address";
import { Card3D } from "@/components/ui/card-3d-new";
import { 
  ChevronRight, 
  Upload,
  Check,
  Copy
} from "lucide-react";
import QRCode from "react-qr-code";

type CardType = {
  id: number;
  name: string;
  description: string;
  priceBNB: number;
  imageUrl: string;
  priceUSD: number;
};

const PAYMENT_ADDRESS = "0xf8F9a26aDaEba581099425eCF3Bd52BD19C19e79";

export default function CardDetail() {
  const [match, params] = useRoute("/card-details/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gbpId, setGbpId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cardId = match ? parseInt(params.id) : -1;

  const { data: card, isLoading: isCardLoading } = useQuery<CardType>({
    queryKey: [`/api/cards/${cardId}`],
    enabled: cardId > 0,
  });

  const orderMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to submit order');
      }
      
      return res.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      // Clear form
      setFullName("");
      setEmail("");
      setGbpId("");
      setAccountNumber("");
      setReceiptFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Address Copied",
      description: "Payment address copied to clipboard",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptFile) {
      toast({
        title: "Missing Receipt",
        description: "Please upload a receipt image",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("cardId", cardId.toString());
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("gbpId", gbpId);
    formData.append("accountNumber", accountNumber);
    formData.append("receipt", receiptFile);
    
    orderMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleReturnHome = () => {
    setShowSuccess(false);
    navigate("/");
  };

  if (!match) {
    navigate("/");
    return null;
  }

  if (isCardLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="mb-6">The card you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full mx-4 text-center border border-primary/30">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-white mb-2">Submission Successful</h3>
          <p className="text-slate-300 mb-2">Thank you for your purchase!</p>
          <p className="text-slate-300 mb-6">Once your payment is confirmed, your card will be activated within 10 hours.</p>
          <Button onClick={handleReturnHome} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/">
                <span className="text-slate-400 hover:text-primary cursor-pointer">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-slate-500 mx-1" />
              <span className="text-slate-200">{card.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 3D Card and Details */}
          <div>
            <div className="mb-8">
              <Card3D
                id={card.id}
                name={card.name}
                priceBNB={card.priceBNB}
                priceUSD={card.priceUSD}
                imageUrl={card.imageUrl}
                hideActions={true}
              />
            </div>
            <Card className="border-slate-700">
              <CardContent className="p-6">
                <h1 className="text-2xl font-heading font-bold text-white mb-4">{card.name}</h1>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-slate-400">Price:</p>
                    <p className="text-primary text-2xl font-bold">${card.priceUSD.toFixed(2)}</p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-700">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-6 rounded-lg inline-block shadow-lg transition-all duration-300 hover:shadow-xl">
                      <QRCode 
                        value={PAYMENT_ADDRESS} 
                        size={160}
                        bgColor={"#FFFFFF"}
                        fgColor={"#000000"}
                        level={"H"}
                        style={{ 
                          width: "100%", 
                          height: "100%"
                        }}
                      />
                    </div>
                  </div>
                  <BNBAddress 
                    address={PAYMENT_ADDRESS}
                    className="mb-4"
                  />
                  <div className="p-4 bg-slate-800 rounded-lg mb-6">
                    <h4 className="font-medium text-primary mb-2">Payment Instructions:</h4>
                    <ol className="list-decimal list-inside text-slate-300 space-y-2 text-sm">
                      <li>Your order total is <span className="text-primary font-semibold">${card.priceUSD.toFixed(2)}</span></li>
                      <li>Scan the QR code or copy the address above</li>
                      <li>Keep your transaction ID for reference</li>
                      <li>Fill out the form after payment</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card className="border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold text-white mb-6">Complete Your Order</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gbpId">GlobalBusinessPay ID (Optional)</Label>
                  <Input
                    id="gbpId"
                    value={gbpId}
                    onChange={(e) => setGbpId(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium mb-1">Receipt Photo</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-700 rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-500" />
                      <div className="flex text-sm text-slate-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                      {receiptFile && (
                        <p className="text-sm text-primary mt-2">
                          Selected: {receiptFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button
                    type="submit"
                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={orderMutation.isPending}
                  >
                    {orderMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <Spinner className="h-4 w-4 mr-2" />
                        Processing...
                      </span>
                    ) : (
                      "Submit Payment Information"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
