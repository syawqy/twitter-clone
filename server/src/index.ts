// server/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Tweet } from './types';

const app = new Hono();

// Mengizinkan permintaan dari frontend (client)
app.use('/api/*', cors());

// Simpan data tweet di memori server
let tweets: Tweet[] = [
  {
    id: '1',
    author: 'Hono',
    content: 'Halo, ini tweet pertama!',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    author: 'React',
    content: 'Senang bisa terhubung dengan Hono!',
    timestamp: new Date().toISOString(),
  },
];

// Buat routes object untuk RPC
const apiRoutes = new Hono()
  .get('/tweets', (c) => {
    return c.json(tweets);
  })
  .post('/tweets', async (c) => {
    const { author, content } = await c.req.json<{ author: string; content: string }>();
    
    if (!author || !content) {
      return c.json({ error: 'Author dan content dibutuhkan' }, 400);
    }

    const newTweet: Tweet = {
      id: String(tweets.length + 1),
      author,
      content,
      timestamp: new Date().toISOString(),
    };

    tweets.push(newTweet);
    
    // Mengurutkan tweet dari yang terbaru
    tweets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json(newTweet, 201);
  });

// Mount routes ke /api path
app.route('/api', apiRoutes);

export default app;
export type AppType = typeof apiRoutes;
