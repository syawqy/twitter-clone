// client/src/components/TweetForm.tsx
import { useState } from 'react';
import { api } from '../lib/api'; // Impor klien API

interface TweetFormProps {
  onTweetPosted: () => void;
}

export function TweetForm({ onTweetPosted }: TweetFormProps) {
  const [content, setContent] = useState('');
  const [author] = useState('User React');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.tweets.$post({
        json: {
          author,
          content,
        },
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim tweet');
      }

      setContent('');
      onTweetPosted(); // Panggil callback untuk memuat ulang daftar tweet
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim tweet. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tweet-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Apa yang sedang kamu pikirkan?"
        rows={3}
        maxLength={280}
      />
      <div className="form-footer">
        <span>{280 - content.length}</span>
        <button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Tweet'}
        </button>
      </div>
    </form>
  );
}