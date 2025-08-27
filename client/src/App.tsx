// client/src/App.tsx
import { useEffect, useState, useCallback } from 'react'; // Tambahkan useCallback
import { api } from './lib/api';
import type { Tweet } from '../../server/src/types';
import { TweetForm } from './components/TweetForm'; // Impor komponen form
import './App.css';

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  // Gunakan useCallback agar fungsi ini tidak dibuat ulang setiap render
  const fetchTweets = useCallback(async () => {
    try {
      const res = await api.tweets.$get();
      if (res.ok) {
        const data = await res.json();
        setTweets(data);
      } else {
        console.error('Gagal mengambil tweets:', await res.text());
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  if (loading) {
    return <div>Memuat tweet...</div>;
  }

  return (
    <div className="app-container">
      <h1>Klon Twitter</h1>
      {/* Tambahkan komponen form di sini */}
      <TweetForm onTweetPosted={fetchTweets} />
      <div className="tweet-list">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="tweet-item">
            <strong>{tweet.author}</strong>
            <p>{tweet.content}</p>
            <small>{new Date(tweet.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
