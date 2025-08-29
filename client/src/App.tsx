// client/src/App.tsx
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './lib/api';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { WebSocketStatus } from './components/WebSocketStatus';
import { TweetForm } from './components/TweetForm';
import { TweetList } from './components/TweetList';
import { useAuth } from './contexts/AuthContext';
import { useWebSocket } from './hooks/useWebSocket';
import type { Tweet } from './types/auth';

function TwitterApp() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  
  // WebSocket integration for real-time updates
  const token = useMemo(() => {
    // Don't attempt WebSocket connection while auth is loading
    if (authLoading) return null;
    return user ? localStorage.getItem('auth_token') : null;
  }, [user, authLoading]);
  const wsCallbacks = useMemo(() => ({
    onNewTweet: (tweet: Tweet) => {
      console.log('Received new tweet via WebSocket:', tweet);
      setTweets(prev => {
        // Check if tweet already exists to prevent duplicates
        const exists = prev.some(t => t.id === tweet.id);
        if (exists) {
          console.log('Tweet already exists, skipping duplicate:', tweet.id);
          return prev;
        }
        return [tweet, ...prev];
      });
    },
    onConnect: () => {
      console.log('Connected to WebSocket for real-time updates');
    },
    onDisconnect: () => {
      console.log('Disconnected from WebSocket');
    },
    onError: (error: Event) => {
      console.error('WebSocket error:', error);
    }
  }), []);
  
  const { isConnected, isConnecting, error: wsError } = useWebSocket(token, wsCallbacks);

  // Fungsi untuk mengambil tweets
  const fetchTweets = async () => {
    try {
      const response = await api.tweets.$get();
      const data = await response.json();
      setTweets(data); // Server returns tweets array directly
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  // Fungsi untuk mengirim tweet baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweet.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await api.tweets.$post({
        json: {
          content: newTweet,
          author: user.username
        }
      });
      
      if (response.ok) {
        setNewTweet('');
        await fetchTweets(); // Refresh tweets
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tweets saat komponen dimount
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="container">
          <WebSocketStatus 
            isConnected={isConnected}
            isConnecting={isConnecting}
            error={wsError}
          />
          
          <TweetForm 
            newTweet={newTweet}
            setNewTweet={setNewTweet}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          
          <TweetList tweets={tweets} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <TwitterApp />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
