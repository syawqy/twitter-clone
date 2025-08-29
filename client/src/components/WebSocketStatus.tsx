// client/src/components/WebSocketStatus.tsx
import React from 'react';

interface WebSocketStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  isConnected,
  isConnecting,
  error
}) => {
  return (
    <div className="websocket-status">
      <div className={`status-indicator ${
        isConnected ? 'connected' : 
        isConnecting ? 'connecting' : 
        'disconnected'
      }`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isConnected ? 'Live updates active' : 
           isConnecting ? 'Connecting...' : 
           'Offline mode'}
        </span>
      </div>
      {error && (
        <div className="websocket-error">
          Connection error: {error}
        </div>
      )}
    </div>
  );
};