// server/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Tweet, User, LoginRequest, RegisterRequest, AuthResponse, JWTPayload } from './types';
import { hashPassword, verifyPassword, generateToken, toUserPublic, authMiddleware, optionalAuthMiddleware } from './auth';
import TweetWebSocketServer from './websocket';

const app = new Hono();

// Initialize WebSocket server
const wsServer = new TweetWebSocketServer(8080);

// Mengizinkan permintaan dari frontend (client)
app.use('/api/*', cors());

// Simpan data di memori server
let users: User[] = [];
let tweets: Tweet[] = [
  {
    id: '1',
    author: 'Hono',
    content: 'Halo, ini tweet pertama!',
    timestamp: new Date().toISOString(),
    userId: 'system',
  },
  {
    id: '2',
    author: 'React',
    content: 'Senang bisa terhubung dengan Hono!',
    timestamp: new Date().toISOString(),
    userId: 'system',
  },
];

// Helper functions
function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Buat routes object untuk RPC
const apiRoutes = new Hono()
  // Auth routes
  .post('/auth/register', async (c) => {
    try {
      const { username, email, password }: RegisterRequest = await c.req.json();
      
      if (!username || !email || !password) {
        return c.json({ error: 'Username, email, dan password dibutuhkan' }, 400);
      }
      
      if (password.length < 6) {
        return c.json({ error: 'Password minimal 6 karakter' }, 400);
      }
      
      // Check if user already exists
      if (findUserByEmail(email)) {
        return c.json({ error: 'Email sudah terdaftar' }, 400);
      }
      
      // Create new user
      const hashedPassword = await hashPassword(password);
      const newUser: User = {
        id: generateUserId(),
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      
      // Generate token and return response
      const userPublic = toUserPublic(newUser);
      const token = generateToken(userPublic);
      
      const response: AuthResponse = {
        user: userPublic,
        token,
      };
      
      return c.json(response, 201);
    } catch (error) {
      return c.json({ error: 'Terjadi kesalahan saat registrasi' }, 500);
    }
  })
  .post('/auth/login', async (c) => {
    try {
      const { email, password }: LoginRequest = await c.req.json();
      
      if (!email || !password) {
        return c.json({ error: 'Email dan password dibutuhkan' }, 400);
      }
      
      // Find user
      const user = findUserByEmail(email);
      if (!user) {
        return c.json({ error: 'Email atau password salah' }, 401);
      }
      
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return c.json({ error: 'Email atau password salah' }, 401);
      }
      
      // Generate token and return response
      const userPublic = toUserPublic(user);
      const token = generateToken(userPublic);
      
      const response: AuthResponse = {
        user: userPublic,
        token,
      };
      
      return c.json(response);
    } catch (error) {
      return c.json({ error: 'Terjadi kesalahan saat login' }, 500);
    }
  })
  // Tweet routes
   .get('/tweets', (c) => {
     return c.json(tweets);
   })
   .get('/ws/status', (c) => {
     return c.json({
       connected_clients: wsServer.getConnectedClientsCount(),
       websocket_port: 8080,
       status: 'running'
     });
   })
  .post('/tweets', authMiddleware, async (c) => {
    try {
      const user = c.get('user') as JWTPayload;
      const { content } = await c.req.json<{ content: string }>();
      
      if (!content) {
        return c.json({ error: 'Content dibutuhkan' }, 400);
      }
      
      if (content.length > 280) {
        return c.json({ error: 'Tweet tidak boleh lebih dari 280 karakter' }, 400);
      }

      const newTweet: Tweet = {
        id: String(tweets.length + 1),
        author: user.username,
        content,
        timestamp: new Date().toISOString(),
        userId: user.userId,
      };

      tweets.push(newTweet);
       
       // Mengurutkan tweet dari yang terbaru
       tweets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

       // Broadcast new tweet to WebSocket clients
       wsServer.broadcastNewTweet(newTweet);

       return c.json(newTweet, 201);
    } catch (error) {
      return c.json({ error: 'Terjadi kesalahan saat membuat tweet' }, 500);
    }
  });

// Mount routes ke /api path
app.route('/api', apiRoutes);

export default app;
export type AppType = typeof apiRoutes;
