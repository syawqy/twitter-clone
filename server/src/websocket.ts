// server/src/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from './auth';
import type { JWTPayload, Tweet } from './types';

interface AuthenticatedWebSocket extends WebSocket {
  user?: JWTPayload;
  isAlive?: boolean;
}

class TweetWebSocketServer {
  private wss: WebSocketServer;
  private clients: Set<AuthenticatedWebSocket> = new Set();

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupWebSocketServer();
    this.setupHeartbeat();
    console.log(`WebSocket server started on port ${port}`);
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('New WebSocket connection');
      
      // Set initial state
      ws.isAlive = true;
      
      // Handle authentication
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'auth' && data.token) {
            const user = verifyToken(data.token);
            if (user) {
              ws.user = user;
              this.clients.add(ws);
              ws.send(JSON.stringify({ 
                type: 'auth_success', 
                message: 'Authenticated successfully',
                user: { username: user.username, userId: user.userId }
              }));
              console.log(`User ${user.username} authenticated via WebSocket`);
            } else {
              ws.send(JSON.stringify({ 
                type: 'auth_error', 
                message: 'Invalid token' 
              }));
              ws.close();
            }
          } else if (data.type === 'ping') {
            ws.isAlive = true;
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      // Handle connection close
      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });
  }

  private setupHeartbeat() {
    // Ping clients every 30 seconds to keep connection alive
    setInterval(() => {
      this.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          console.log('Terminating dead WebSocket connection');
          this.clients.delete(ws);
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  // Broadcast new tweet to all authenticated clients
  public broadcastNewTweet(tweet: Tweet) {
    const message = JSON.stringify({
      type: 'new_tweet',
      data: tweet
    });

    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN && ws.user) {
        try {
          ws.send(message);
        } catch (error) {
          console.error('Error sending tweet to client:', error);
          this.clients.delete(ws);
        }
      }
    });

    console.log(`Broadcasted new tweet to ${this.clients.size} clients`);
  }

  // Get connected clients count
  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  // Close WebSocket server
  public close() {
    this.wss.close();
    console.log('WebSocket server closed');
  }
}

export default TweetWebSocketServer;