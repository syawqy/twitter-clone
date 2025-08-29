// client/src/components/TweetForm.tsx
import React from 'react';

interface TweetFormProps {
  newTweet: string;
  setNewTweet: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const TweetForm: React.FC<TweetFormProps> = ({
  newTweet,
  setNewTweet,
  onSubmit,
  isLoading
}) => {
  return (
    <form onSubmit={onSubmit} className="tweet-form">
      <textarea
        value={newTweet}
        onChange={(e) => setNewTweet(e.target.value)}
        placeholder="What's happening?"
        className="tweet-input"
        rows={3}
        maxLength={280}
      />
      <div className="tweet-form-footer">
        <span className="char-count">
          {280 - newTweet.length} characters remaining
        </span>
        <button 
          type="submit" 
          disabled={!newTweet.trim() || isLoading}
          className="tweet-button"
        >
          {isLoading ? 'Posting...' : 'Tweet'}
        </button>
      </div>
    </form>
  );
};