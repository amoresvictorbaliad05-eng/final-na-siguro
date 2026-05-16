import { Router, Response } from 'express';
import pool from '../db/index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// =============================================
// GET /api/logs
// =============================================
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '50' } = req.query;

    const result = await pool.query(
      `SELECT * FROM activity_logs 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [parseInt(limit as string)]
    );

    res.json({
      logs: result.rows.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.user_id,
        userName: log.user_name,
        reportId: log.report_id,
        details: log.details,
        timestamp: log.created_at,
      })),
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
