import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  CreditCard,
  DollarSign,
  MessageSquare,
  Users,
  Send,
  Save,
  Package,
  Bitcoin,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Card = {
  id: number;
  name: string;
  description: string;
  priceBNB: number;
  imageUrl: string;
};

type Order = {
  id: number;
  cardId: number;
  fullName: string;
  email: string;
  gbpId: string;
  accountNumber: string;
  receiptUrl: string;
  status: string;
  createdAt: string;
};

type Message = {
  id: number;
  browserId: string;
  content: string;
  sender: string;
  timestamp: string;
};

type Cryptocurrency = {
  id: number;
  name: string;
  symbol: string;
  usdPrice: number;
  address: string;
  isActive: boolean;
  lastUpdated: string;
};

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [bnbPrice, setBnbPrice] = useState("");
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [cardPrice, setCardPrice] = useState("");
  
  // Cryptocurrency state
  const [editingCrypto, setEditingCrypto] = useState<number | null>(null);
  const [cryptoName, setCryptoName] = useState("");
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [cryptoPrice, setCryptoPrice] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [isAddingCrypto, setIsAddingCrypto] = useState(false);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/orders", {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: cards, isLoading: isCardsLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const { data: messages, isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const { data: cryptocurrencies, isLoading: isCryptoLoading } = useQuery<Cryptocurrency[]>({
    queryKey: ["/api/cryptocurrencies"],
  });

  const { data: bnbPriceData } = useQuery({
    queryKey: ["/api/bnb-price"],
    onSuccess: (data) => {
      if (data && data.price) {
        setBnbPrice(data.price.toString());
      }
    },
  });

  const updateBnbPriceMutation = useMutation({
    mutationFn: async (price: number) => {
      const response = await apiRequest("POST", "/api/admin/bnb-price", {
        price,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bnb-price"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Price Updated",
        description: "BNB price has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update BNB price",
        variant: "destructive",
      });
    },
  });

  const updateCardPriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: number; price: number }) => {
      const response = await apiRequest("PATCH", `/api/admin/cards/${id}`, {
        priceUSD: price,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      setEditingCard(null);
      setCardPrice("");
      toast({
        title: "Card Updated",
        description: "Card USD price has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update card price",
        variant: "destructive",
      });
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: async ({ browserId, content }: { browserId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        browserId,
        content,
        sender: "admin",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setReplyMessage("");
      toast({
        title: "Message Sent",
        description: "Reply has been sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Send Failed",
        description: "Failed to send reply",
        variant: "destructive",
      });
    },
  });
  
  const updateCryptoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Cryptocurrency> }) => {
      const response = await apiRequest("PATCH", `/api/admin/cryptocurrencies/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptocurrencies"] });
      setEditingCrypto(null);
      setCryptoName("");
      setCryptoSymbol("");
      setCryptoPrice("");
      setCryptoAddress("");
      toast({
        title: "Cryptocurrency Updated",
        description: "Cryptocurrency has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update cryptocurrency",
        variant: "destructive",
      });
    },
  });
  
  const createCryptoMutation = useMutation({
    mutationFn: async (data: { name: string; symbol: string; usdPrice: number; address: string }) => {
      const response = await apiRequest("POST", "/api/admin/cryptocurrencies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptocurrencies"] });
      setIsAddingCrypto(false);
      setCryptoName("");
      setCryptoSymbol("");
      setCryptoPrice("");
      setCryptoAddress("");
      toast({
        title: "Cryptocurrency Added",
        description: "New cryptocurrency has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to add new cryptocurrency",
        variant: "destructive",
      });
    },
  });
  
  const toggleCryptoStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/cryptocurrencies/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptocurrencies"] });
      toast({
        title: "Status Updated",
        description: "Cryptocurrency status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update cryptocurrency status",
        variant: "destructive",
      });
    },
  });

  const handleUpdateBnbPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(bnbPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    updateBnbPriceMutation.mutate(price);
  };

  const handleUpdateCardPrice = (id: number) => {
    const price = parseFloat(cardPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    updateCardPriceMutation.mutate({ id, price });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !replyMessage.trim()) return;
    
    sendReplyMutation.mutate({
      browserId: activeChat,
      content: replyMessage,
    });
  };
  
  const handleUpdateCrypto = (id: number) => {
    const price = parseFloat(cryptoPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid positive number for price",
        variant: "destructive",
      });
      return;
    }
    
    if (!cryptoName.trim() || !cryptoSymbol.trim() || !cryptoAddress.trim()) {
      toast({
        title: "Invalid Input",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    updateCryptoMutation.mutate({
      id,
      data: {
        name: cryptoName,
        symbol: cryptoSymbol,
        usdPrice: price,
        address: cryptoAddress
      }
    });
  };
  
  const handleCreateCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(cryptoPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid positive number for price",
        variant: "destructive",
      });
      return;
    }
    
    if (!cryptoName.trim() || !cryptoSymbol.trim() || !cryptoAddress.trim()) {
      toast({
        title: "Invalid Input",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    createCryptoMutation.mutate({
      name: cryptoName,
      symbol: cryptoSymbol,
      usdPrice: price,
      address: cryptoAddress
    });
  };
  
  const handleToggleCryptoStatus = (id: number, currentStatus: boolean) => {
    toggleCryptoStatusMutation.mutate({
      id,
      isActive: !currentStatus
    });
  };

  const startEditing = (card: Card) => {
    setEditingCard(card.id);
    setCardPrice(card.priceUSD.toString());
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setCardPrice("");
  };

  const startEditingCrypto = (crypto: Cryptocurrency) => {
    setEditingCrypto(crypto.id);
    setCryptoName(crypto.name);
    setCryptoSymbol(crypto.symbol);
    setCryptoPrice(crypto.usdPrice.toString());
    setCryptoAddress(crypto.address);
  };

  const cancelEditingCrypto = () => {
    setEditingCrypto(null);
    setCryptoName("");
    setCryptoSymbol("");
    setCryptoPrice("");
    setCryptoAddress("");
  };

  const startAddingCrypto = () => {
    setIsAddingCrypto(true);
    setCryptoName("");
    setCryptoSymbol("");
    setCryptoPrice("");
    setCryptoAddress("");
  };

  const cancelAddingCrypto = () => {
    setIsAddingCrypto(false);
    setCryptoName("");
    setCryptoSymbol("");
    setCryptoPrice("");
    setCryptoAddress("");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-4 w-full md:w-auto">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4" />
            <span className="hidden sm:inline">Crypto</span>
          </TabsTrigger>
          <TabsTrigger value="price" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Order Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>GBP ID</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Card</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.fullName}</TableCell>
                          <TableCell>{order.email}</TableCell>
                          <TableCell>{order.gbpId}</TableCell>
                          <TableCell>{order.accountNumber}</TableCell>
                          <TableCell>
                            {cards?.find((c) => c.id === order.cardId)?.name || order.cardId}
                          </TableCell>
                          <TableCell>
                            <a 
                              href={order.receiptUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Receipt
                            </a>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  No orders have been submitted yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card className="border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Manage Cards</CardTitle>
            </CardHeader>
            <CardContent>
              {isCardsLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
              ) : cards && cards.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Card Name</TableHead>
                        <TableHead>Price (USD)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cards.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell>{card.id}</TableCell>
                          <TableCell>{card.name}</TableCell>
                          <TableCell>
                            {editingCard === card.id ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <Input
                                  value={cardPrice}
                                  onChange={(e) => setCardPrice(e.target.value)}
                                  className="pl-8 w-32 bg-slate-800 border-slate-700 text-white"
                                />
                              </div>
                            ) : (
                              `$${card.priceUSD ? card.priceUSD.toFixed(2) : card.priceBNB}`
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingCard === card.id ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                                  onClick={() => handleUpdateCardPrice(card.id)}
                                  disabled={updateCardPriceMutation.isPending}
                                >
                                  {updateCardPriceMutation.isPending ? (
                                    <Spinner className="h-4 w-4" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(card)}
                              >
                                Edit Price
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  No cards found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cryptocurrency Tab */}
        <TabsContent value="crypto">
          <Card className="border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-heading">Manage Cryptocurrencies</CardTitle>
              <Button 
                onClick={startAddingCrypto}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isAddingCrypto}
              >
                Add New Cryptocurrency
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingCrypto && (
                <div className="mb-8 p-4 border border-slate-700 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Add New Cryptocurrency</h3>
                  <form onSubmit={handleCreateCrypto} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="crypto-name">Name</Label>
                        <Input
                          id="crypto-name"
                          value={cryptoName}
                          onChange={(e) => setCryptoName(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="e.g. Bitcoin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crypto-symbol">Symbol</Label>
                        <Input
                          id="crypto-symbol"
                          value={cryptoSymbol}
                          onChange={(e) => setCryptoSymbol(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="e.g. BTC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crypto-price">USD Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input
                            id="crypto-price"
                            value={cryptoPrice}
                            onChange={(e) => setCryptoPrice(e.target.value)}
                            className="pl-8 bg-slate-800 border-slate-700 text-white"
                            placeholder="e.g. 50000.00"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crypto-address">Wallet Address</Label>
                        <Input
                          id="crypto-address"
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="Enter wallet address"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelAddingCrypto}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={createCryptoMutation.isPending}
                      >
                        {createCryptoMutation.isPending ? (
                          <Spinner className="h-4 w-4 mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Cryptocurrency
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {isCryptoLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
              ) : cryptocurrencies && cryptocurrencies.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>USD Price</TableHead>
                        <TableHead>Wallet Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cryptocurrencies.map((crypto) => (
                        <TableRow key={crypto.id}>
                          <TableCell>{crypto.name}</TableCell>
                          <TableCell>{crypto.symbol}</TableCell>
                          <TableCell>
                            {editingCrypto === crypto.id ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <Input
                                  value={cryptoPrice}
                                  onChange={(e) => setCryptoPrice(e.target.value)}
                                  className="pl-8 w-32 bg-slate-800 border-slate-700 text-white"
                                />
                              </div>
                            ) : (
                              `$${crypto.usdPrice.toLocaleString()}`
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {editingCrypto === crypto.id ? (
                              <Input
                                value={cryptoAddress}
                                onChange={(e) => setCryptoAddress(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            ) : (
                              crypto.address
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={crypto.isActive ? "default" : "outline"}
                              className={crypto.isActive ? "bg-green-600 hover:bg-green-700" : "text-slate-400"}
                              onClick={() => handleToggleCryptoStatus(crypto.id, crypto.isActive)}
                              disabled={toggleCryptoStatusMutation.isPending}
                            >
                              {crypto.isActive ? (
                                <><CheckCircle className="h-4 w-4 mr-1" /> Active</>
                              ) : (
                                <><XCircle className="h-4 w-4 mr-1" /> Inactive</>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>{new Date(crypto.lastUpdated).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {editingCrypto === crypto.id ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditingCrypto}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                                  onClick={() => handleUpdateCrypto(crypto.id)}
                                  disabled={updateCryptoMutation.isPending}
                                >
                                  {updateCryptoMutation.isPending ? (
                                    <Spinner className="h-4 w-4" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingCrypto(crypto)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  No cryptocurrencies found. Please add one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* BNB Price Tab */}
        <TabsContent value="price">
          <Card className="border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Update BNB Price</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBnbPrice} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="bnb-price">BNB to USD Price</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input
                        id="bnb-price"
                        value={bnbPrice}
                        onChange={(e) => setBnbPrice(e.target.value)}
                        className="pl-8 bg-slate-800 border-slate-700 text-white"
                        placeholder="Enter BNB price in USD"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={updateBnbPriceMutation.isPending}
                    >
                      {updateBnbPriceMutation.isPending ? (
                        <Spinner className="h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Update Price
                    </Button>
                  </div>
                </div>
                {bnbPriceData?.lastUpdated && (
                  <p className="text-sm text-slate-400">
                    Last updated: {new Date(bnbPriceData.lastUpdated).toLocaleString()}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chats Tab */}
        <TabsContent value="chats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-700 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl font-heading">Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {isMessagesLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="h-8 w-8 text-primary" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-2">
                    {Array.from(new Set(messages.map((m) => m.browserId))).map((browserId) => (
                      <Button
                        key={browserId}
                        variant={activeChat === browserId ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveChat(browserId)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        User {browserId.substring(0, 8)}...
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    No chat sessions found.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-heading">
                  {activeChat ? `Chat with User ${activeChat.substring(0, 8)}...` : "Select a chat to view messages"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeChat ? (
                  <>
                    <div className="h-80 overflow-y-auto p-4 mb-4 border border-slate-700 rounded-md space-y-4">
                      {messages
                        ?.filter((m) => m.browserId === activeChat)
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start ${
                              message.sender === "admin" ? "justify-end" : ""
                            }`}
                          >
                            {message.sender !== "admin" && (
                              <div className="flex-shrink-0 mr-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                  U
                                </div>
                              </div>
                            )}
                            <div
                              className={`rounded-lg p-3 max-w-[85%] ${
                                message.sender === "admin"
                                  ? "bg-primary/20"
                                  : "bg-slate-800"
                              }`}
                            >
                              <p className="text-white text-sm">{message.content}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            {message.sender === "admin" && (
                              <div className="flex-shrink-0 ml-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                  A
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <Input
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-grow bg-slate-800 border-slate-700 text-white"
                      />
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={sendReplyMutation.isPending || !replyMessage.trim()}
                      >
                        {sendReplyMutation.isPending ? (
                          <Spinner className="h-4 w-4 mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Send
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    Select a chat session from the list to view and reply to messages.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
