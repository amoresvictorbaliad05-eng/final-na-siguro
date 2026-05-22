import { Router, Response, Request } from 'express';
import pool from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// =============================================
// GET /api/notifications
// =============================================
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [authReq.user!.id]
    );

    const unreadCount = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
      [authReq.user!.id]
    );

    res.json({
      notifications: result.rows.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.is_read,
        relatedReportId: n.related_report_id,
        createdAt: n.created_at,
      })),
      unreadCount: parseInt(unreadCount.rows[0].count),
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// PATCH /api/notifications/:id/read
// =============================================
router.patch('/:id/read', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
      [req.params.id, authReq.user!.id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// PATCH /api/notifications/read-all
// =============================================
router.patch('/read-all', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
      [authReq.user!.id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
