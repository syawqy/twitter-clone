// client/src/components/Tweet.tsx
import React from 'react';
import type { Tweet as TweetType } from '../types/auth';

interface TweetProps {
  tweet: TweetType;
}

export const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  return (
    <div className="tweet">
      <div className="tweet-header">
        <span className="tweet-author">@{tweet.author}</span>
        <span className="tweet-timestamp">
          {new Date(tweet.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="tweet-content">{tweet.content}</div>
    </div>
  );
};