// client/src/components/TweetList.tsx
import React from 'react';
import { Tweet } from './Tweet';
import type { Tweet as TweetType } from '../types/auth';

interface TweetListProps {
  tweets: TweetType[];
}

export const TweetList: React.FC<TweetListProps> = ({ tweets }) => {
  if (tweets.length === 0) {
    return (
      <div className="tweets-container">
        <p className="no-tweets">No tweets yet. Be the first to tweet!</p>
      </div>
    );
  }

  return (
    <div className="tweets-container">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};