import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'barangay-bantay-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin' | 'superadmin';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token middleware
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Admin-only middleware
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
}

// Super admin-only middleware
export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
  }
  next();
}
