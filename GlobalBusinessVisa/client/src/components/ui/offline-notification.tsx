import { useState, useEffect } from 'react';
import { X, Wifi, WifiOff } from 'lucide-react';

export function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
      setCanInstall(false);
    });
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm bg-slate-800 rounded-lg shadow-lg border ${isOffline ? 'border-red-500' : 'border-green-500'} p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {isOffline ? (
            <WifiOff className="h-5 w-5 text-red-500" />
          ) : (
            <Wifi className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-white">
            {isOffline ? 'You are offline' : 'Back online'}
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            {isOffline 
              ? 'The app will continue to work with limited functionality. Some data might not be up to date.' 
              : 'You are connected again. All features are now available.'
            }
          </p>
          {canInstall && !isOffline && (
            <button 
              onClick={handleInstallClick}
              className="mt-2 bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary/90"
            >
              Install App
            </button>
          )}
        </div>
        <button 
          onClick={handleDismiss}
          className="flex-shrink-0 ml-4 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}