// server/src/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Context } from 'hono';
import type { JWTPayload, User, UserPublic } from './types';

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: UserPublic): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    username: user.username
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Convert User to UserPublic (remove password)
export function toUserPublic(user: User): UserPublic {
  const { password, ...userPublic } = user;
  return userPublic;
}

// Auth middleware for Hono
export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Token tidak ditemukan' }, 401);
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const payload = verifyToken(token);
  
  if (!payload) {
    return c.json({ error: 'Token tidak valid' }, 401);
  }
  
  // Add user info to context
  c.set('user', payload);
  await next();
}

// Optional auth middleware (doesn't fail if no token)
export async function optionalAuthMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (payload) {
      c.set('user', payload);
    }
  }
  
  await next();
}