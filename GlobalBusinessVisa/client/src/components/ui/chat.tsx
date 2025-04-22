import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

type Message = {
  id: number;
  browserId: string;
  content: string;
  sender: string;
  timestamp: Date;
};

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, isLoading, addMessage, initializeWebSocket, webSocket } = useChat();

  useEffect(() => {
    if (isOpen) {
      initializeWebSocket();
      setUnreadCount(0);
    }
  }, [isOpen, initializeWebSocket]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Increment unread counter when new messages arrive and chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'support') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      // Set typing indicator
      setIsTyping(true);
      
      // Create message in database
      const response = await apiRequest('POST', '/api/messages', {
        content: message,
        sender: 'user'
      });
      
      if (response.ok) {
        const newMessage = await response.json();
        addMessage(newMessage);
        setMessage("");
        
        // Typing indicator will be automatically removed when the AI response comes in
        // but we should set a timeout just in case (5 seconds)
        setTimeout(() => {
          setIsTyping(false);
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format timestamp for display
  const formatMessageTime = (timestamp: Date) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  // Render AI typing indicator
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            <Bot className="h-4 w-4" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 max-w-[85%]">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <Button
        onClick={toggleChat}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors duration-200 relative"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        ) : (
          <>
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-96 max-w-md bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden">
          <div className="bg-primary/90 p-3 sm:p-4 flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary-foreground" />
              AI Assistant
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-slate-200 hover:text-white hover:bg-primary/80"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="h-[60vh] sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-950/80">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner className="h-8 w-8 text-primary" />
              </div>
            ) : (
              <>
                {/* Initial support message */}
                {messages.length === 0 && (
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 max-w-[85%]">
                      <p className="text-white text-sm">Hello! 👋 I'm your assistant for the Global Business Card portal. I'm here to help with information about our premium card options and benefits. How can I assist you today?</p>
                      <p className="text-xs text-slate-400 mt-1">{formatMessageTime(new Date())}</p>
                    </div>
                  </div>
                )}
                
                {/* Message history */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start ${
                      msg.sender === "user" ? "justify-end" : ""
                    } mb-3 sm:mb-4`}
                  >
                    {msg.sender !== "user" && (
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          <Bot className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-2 sm:p-3 max-w-[85%] ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-primary-foreground/70" : "text-slate-400"
                      }`}>
                        {formatMessageTime(new Date(msg.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {renderTypingIndicator()}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          <div className="p-3 sm:p-4 border-t border-slate-700 bg-slate-900">
            <form onSubmit={handleSubmit} className="flex">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-slate-800 border-slate-700 text-white focus:ring-primary"
                disabled={isLoading || isTyping}
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground ml-2 px-4"
                disabled={isLoading || isTyping || !message.trim()}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-center text-slate-500">
              Global Business Pay Support
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
