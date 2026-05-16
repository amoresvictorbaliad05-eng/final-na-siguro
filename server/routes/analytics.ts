import { Router, Response } from 'express';
import pool from '../db/index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// =============================================
// GET /api/analytics/overview
// =============================================
router.get('/overview', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Get total counts
    const totalResult = await pool.query('SELECT COUNT(*) FROM reports');
    const pendingResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'pending'");
    const approvedResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'approved'");
    const rejectedResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'rejected'");
    const resolvedResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'resolved'");
    const underReviewResult = await pool.query("SELECT COUNT(*) FROM reports WHERE status = 'under_review'");

    // Today's reports
    const todayResult = await pool.query(
      "SELECT COUNT(*) FROM reports WHERE DATE(created_at) = CURRENT_DATE"
    );

    // This week's reports
    const weekResult = await pool.query(
      "SELECT COUNT(*) FROM reports WHERE created_at >= NOW() - INTERVAL '7 days'"
    );

    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');

    res.json({
      total: parseInt(totalResult.rows[0].count),
      pending: parseInt(pendingResult.rows[0].count),
      approved: parseInt(approvedResult.rows[0].count),
      rejected: parseInt(rejectedResult.rows[0].count),
      resolved: parseInt(resolvedResult.rows[0].count),
      underReview: parseInt(underReviewResult.rows[0].count),
      today: parseInt(todayResult.rows[0].count),
      thisWeek: parseInt(weekResult.rows[0].count),
      totalUsers: parseInt(usersResult.rows[0].count),
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/categories
// =============================================
router.get('/categories', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) as count 
       FROM reports 
       GROUP BY category 
       ORDER BY count DESC`
    );

    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Analytics categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/status-distribution
// =============================================
router.get('/status-distribution', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM reports 
       GROUP BY status 
       ORDER BY count DESC`
    );

    res.json({ statuses: result.rows });
  } catch (error) {
    console.error('Analytics status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/monthly-trend
// =============================================
router.get('/monthly-trend', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'Mon YY') as month,
         COUNT(*) as count
       FROM reports
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'Mon YY'), DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at)`
    );

    res.json({ trend: result.rows });
  } catch (error) {
    console.error('Analytics trend error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/barangay-distribution
// =============================================
router.get('/barangay-distribution', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT barangay, COUNT(*) as count 
       FROM reports 
       GROUP BY barangay 
       ORDER BY count DESC`
    );

    res.json({ barangays: result.rows });
  } catch (error) {
    console.error('Analytics barangay error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/severity-distribution
// =============================================
router.get('/severity-distribution', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT severity, COUNT(*) as count 
       FROM reports 
       GROUP BY severity 
       ORDER BY 
         CASE severity 
           WHEN 'critical' THEN 1 
           WHEN 'high' THEN 2 
           WHEN 'medium' THEN 3 
           WHEN 'low' THEN 4 
         END`
    );

    res.json({ severities: result.rows });
  } catch (error) {
    console.error('Analytics severity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/day-of-week
// =============================================
router.get('/day-of-week', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'Dy') as day,
         EXTRACT(DOW FROM created_at) as day_num,
         COUNT(*) as count
       FROM reports
       GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
       ORDER BY day_num`
    );

    res.json({ days: result.rows });
  } catch (error) {
    console.error('Analytics day-of-week error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/analytics/category-by-status
// =============================================
router.get('/category-by-status', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
         category,
         status,
         COUNT(*) as count
       FROM reports
       GROUP BY category, status
       ORDER BY category, status`
    );

    // Transform into nested structure
    const transformed: Record<string, Record<string, number>> = {};
    result.rows.forEach((row: any) => {
      if (!transformed[row.category]) {
        transformed[row.category] = {};
      }
      transformed[row.category][row.status] = parseInt(row.count);
    });

    res.json({ data: transformed });
  } catch (error) {
    console.error('Analytics category-by-status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
