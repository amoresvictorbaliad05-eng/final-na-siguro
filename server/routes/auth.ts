import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import pool from '../db/index.js';
import { generateToken, authenticate, AuthRequest, AuthUser } from '../middleware/auth.js';

const router = Router();

// =============================================
// POST /api/auth/register
// =============================================
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
  ],
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, address, barangay } = req.body;

      // Check if user exists
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, address, barangay, role, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, 'citizen', false)
         RETURNING id, name, email, phone, address, barangay, role, is_verified, created_at`,
        [name, email, passwordHash, phone, address, barangay || 'Brgy. San Antonio']
      );

      const user = result.rows[0];

      // Generate token
      const tokenUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      const token = generateToken(tokenUser);

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (action, user_id, user_name, details)
         VALUES ('register', $1, $2, 'New user registered')`,
        [user.id, user.name]
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          barangay: user.barangay,
          role: user.role,
          isVerified: user.is_verified,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// =============================================
// POST /api/auth/login
// =============================================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'No account found with this email address.' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }

      // Generate token
      const tokenUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      const token = generateToken(tokenUser);

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (action, user_id, user_name, details)
         VALUES ('login', $1, $2, 'User logged in')`,
        [user.id, user.name]
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          barangay: user.barangay,
          role: user.role,
          isVerified: user.is_verified,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// =============================================
// GET /api/auth/me
// =============================================
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, address, barangay, role, is_verified, created_at FROM users WHERE id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        barangay: user.barangay,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
