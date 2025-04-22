import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CardDetail from "@/pages/CardDetail";
import CardSelection from "@/pages/CardSelection";
import OrderPage from "@/pages/OrderPage";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Benefits from "@/pages/Benefits";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Chat } from "@/components/ui/chat";
import { OfflineNotification } from "@/components/ui/offline-notification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cards" component={CardSelection} />
      <Route path="/card/:id" component={OrderPage} />
      <Route path="/card-details/:id" component={CardDetail} />
      <Route path="/benefits" component={Benefits} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <Chat />
          <OfflineNotification />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
