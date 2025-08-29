// client/src/hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Tweet } from '../types/auth';

interface UseWebSocketOptions {
  onNewTweet?: (tweet: Tweet) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface WebSocketStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWebSocket(token: string | null, options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>({
    isConnected: false,
    isConnecting: false,
    error: null
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const optionsRef = useRef(options);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Update options ref when options change
  optionsRef.current = options;

  const connect = useCallback(() => {
    if (!token) {
      console.log('No token available, skipping WebSocket connection');
      setStatus({ isConnected: false, isConnecting: false, error: 'No authentication token' });
      return;
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ws = new WebSocket('ws://localhost:8080');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected, sending auth...', { hasToken: !!token });
        // Send authentication message only if we have a token
        if (token) {
          ws.send(JSON.stringify({ type: 'auth', token }));
        } else {
          console.error('No token available for WebSocket authentication');
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'auth_success') {
            console.log('WebSocket authenticated successfully');
            setStatus({ isConnected: true, isConnecting: false, error: null });
            reconnectAttemptsRef.current = 0;
            optionsRef.current.onConnect?.();
          } else if (data.type === 'auth_error') {
            console.error('WebSocket authentication failed:', data.message);
            setStatus({ isConnected: false, isConnecting: false, error: data.message || 'Authentication failed' });
            ws.close();
          } else if (data.type === 'new_tweet' && data.data) {
            console.log('Received new tweet via WebSocket:', data.data);
            optionsRef.current.onNewTweet?.(data.data);
          } else if (data.type === 'pong') {
            // Handle heartbeat response
            console.log('Received pong from server');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setStatus({ isConnected: false, isConnecting: false, error: null });
        wsRef.current = null;
        optionsRef.current.onDisconnect?.();

        // Auto-reconnect if not a normal closure, we have a token, and we haven't exceeded max attempts
        if (token && event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus(prev => ({ 
          ...prev, 
          isConnecting: false, 
          error: 'Connection error occurred' 
        }));
        optionsRef.current.onError?.(error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setStatus({ 
        isConnected: false, 
        isConnecting: false, 
        error: 'Failed to create connection' 
      });
    }
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    
    setStatus({ isConnected: false, isConnecting: false, error: null });
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Connect when token is available
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
      // Clear any pending reconnection attempts when token becomes null
      reconnectAttemptsRef.current = 0;
      setStatus({ isConnected: false, isConnecting: false, error: null });
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...status,
    connect,
    disconnect,
    sendMessage
  };
}