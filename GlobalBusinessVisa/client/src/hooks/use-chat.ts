import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  browserId: string;
  content: string;
  sender: string;
  timestamp: Date;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing messages
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/messages'],
    onSuccess: (data) => {
      if (data) {
        setMessages(data);
      }
    },
  });

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'chat') {
            addMessage(data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to chat server. Please try again later.',
          variant: 'destructive',
        });
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
      
      webSocketRef.current = socket;
      
      // Clean up on unmount
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }, [toast]);

  useEffect(() => {
    initializeWebSocket();
    
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [initializeWebSocket]);

  // Add a new message to the chat
  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => {
      // Check if message already exists to prevent duplicates
      const exists = prevMessages.some((msg) => msg.id === message.id);
      if (exists) return prevMessages;
      
      return [...prevMessages, message];
    });
    
    // Invalidate messages query to ensure data is refreshed
    queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
  }, [queryClient]);

  return {
    messages,
    isLoading,
    error,
    addMessage,
    initializeWebSocket,
    webSocket: webSocketRef.current,
  };
}
