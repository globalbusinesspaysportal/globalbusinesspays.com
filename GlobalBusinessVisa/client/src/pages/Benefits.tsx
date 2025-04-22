import { 
  CreditCard, 
  Gift, 
  Shield, 
  Globe, 
  Wallet, 
  Plane, 
  Hotel, 
  LifeBuoy,
  Coins,
  Search,
  Clock,
  Fingerprint
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Benefits() {
  return (
    <>
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-4xl mb-4 text-white">
              GlobalBusinessPay Visa Card Benefits
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Discover the exclusive benefits and features that make our cards the preferred choice for business professionals around the world.
            </p>
          </div>

          {/* Premium Benefits */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading font-bold text-3xl text-white">Premium Card Features</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Gift className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Reward Points</h3>
                  <p className="text-slate-400">
                    Earn points on every purchase that can be redeemed for cashback, travel, and exclusive merchandise.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Shield className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Fraud Protection</h3>
                  <p className="text-slate-400">
                    24/7 fraud monitoring with zero liability for unauthorized charges, keeping your funds secure.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Globe className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Global Acceptance</h3>
                  <p className="text-slate-400">
                    Accepted in over 200 countries and territories, with multi-currency support for seamless transactions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="bg-slate-700 my-16" />

          {/* Travel Benefits */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <Plane className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading font-bold text-3xl text-white">Travel Advantages</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Hotel className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Airport Lounge Access</h3>
                  <p className="text-slate-400">
                    Complimentary access to premium airport lounges worldwide with our Platinum and Black card tiers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <LifeBuoy className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Travel Insurance</h3>
                  <p className="text-slate-400">
                    Comprehensive travel insurance including trip cancellation, lost luggage, and emergency medical coverage.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Wallet className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Foreign Transaction Fees</h3>
                  <p className="text-slate-400">
                    Save money with zero foreign transaction fees when making purchases abroad in any currency.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="bg-slate-700 my-16" />

          {/* Business Benefits */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <Coins className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading font-bold text-3xl text-white">Business Advantages</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Search className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Expense Tracking</h3>
                  <p className="text-slate-400">
                    Detailed transaction reporting and expense categorization to simplify business accounting and tax preparation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Clock className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Priority Support</h3>
                  <p className="text-slate-400">
                    Dedicated 24/7 customer support line with priority service for business cardholders.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <Fingerprint className="text-primary h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Security</h3>
                  <p className="text-slate-400">
                    Biometric authentication, transaction alerts, and real-time spending controls for enhanced security.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}