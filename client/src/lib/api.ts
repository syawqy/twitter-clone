// client/src/lib/api.ts
import { hc } from 'hono/client';
// Impor tipe 'AppType' dari file server
import type { AppType } from '../../../server/src/index';

const client = hc<AppType>('http://localhost:3000/api');

export const api = client;