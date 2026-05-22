import { Router, Response, Request } from 'express';
import { body, query, validationResult } from 'express-validator';
import pool from '../db/index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Generate report number
function generateReportNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'IR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// =============================================
// GET /api/reports
// =============================================
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, category, severity, search, page = '1', limit = '50' } = req.query;
    const isAdmin = (req as AuthRequest).user!.role === 'admin' || (req as AuthRequest).user!.role === 'superadmin';
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    // Non-admin users can only see their own reports
    if (!isAdmin) {
      whereConditions.push(`reporter_id = $${paramIndex}`);
      params.push((req as AuthRequest).user!.id);
      paramIndex++;
    }

    if (status && status !== 'all') {
      whereConditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (category && category !== 'all') {
      whereConditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (severity && severity !== 'all') {
      whereConditions.push(`severity = $${paramIndex}`);
      params.push(severity);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(
        title ILIKE $${paramIndex} OR 
        description ILIKE $${paramIndex} OR 
        report_number ILIKE $${paramIndex} OR 
        location ILIKE $${paramIndex} OR 
        reporter_name ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM reports ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get reports
    const result = await pool.query(
      `SELECT * FROM reports ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, parseInt(limit as string), offset]
    );

    res.json({
      reports: result.rows.map(formatReport),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// GET /api/reports/:id
// =============================================
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = result.rows[0];
    const isAdmin = (req as AuthRequest).user!.role === 'admin' || (req as AuthRequest).user!.role === 'superadmin';

    // Non-admin users can only view their own reports
    if (!isAdmin && report.reporter_id !== (req as AuthRequest).user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ report: formatReport(report) });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =============================================
// POST /api/reports
// =============================================
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('severity').trim().notEmpty().withMessage('Severity is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('barangay').trim().notEmpty().withMessage('Barangay is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title, description, category, severity, location, barangay,
        evidenceDescription, witnessName, witnessContact, isAnonymous,
      } = req.body;

      const reportNumber = generateReportNumber();

      const result = await pool.query(
        `INSERT INTO reports (report_number, reporter_id, reporter_name, title, description, 
         category, severity, status, location, barangay, evidence_description, 
         witness_name, witness_contact, is_anonymous)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [
          reportNumber,
          (req as AuthRequest).user!.id,
          isAnonymous ? 'Anonymous' : (req as AuthRequest).user!.name,
          title,
          description,
          category,
          severity,
          location,
          barangay,
          evidenceDescription || null,
          witnessName || null,
          witnessContact || null,
          isAnonymous || false,
        ]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (action, user_id, user_name, report_id, details)
         VALUES ('report_submitted', $1, $2, $3, 'Submitted new incident report')`,
        [(req as AuthRequest).user!.id, (req as AuthRequest).user!.name, result.rows[0].id]
      );

      res.status(201).json({
        message: 'Report submitted successfully',
        report: formatReport(result.rows[0]),
      });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// =============================================
// PATCH /api/reports/:id/status
// =============================================
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [
    body('status').isIn(['pending', 'under_review', 'approved', 'rejected', 'resolved']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, reviewNotes } = req.body;
      const reportId = req.params.id;

      // Get current report
      const currentReport = await pool.query('SELECT * FROM reports WHERE id = $1', [reportId]);
      if (currentReport.rows.length === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const report = currentReport.rows[0];

      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        pending: ['under_review', 'approved', 'rejected'],
        under_review: ['approved', 'rejected'],
        approved: ['resolved'],
        rejected: [],
        resolved: [],
      };

      if (!validTransitions[report.status]?.includes(status)) {
        return res.status(400).json({
          error: `Cannot transition from ${report.status} to ${status}`,
        });
      }

      // Update report
      const result = await pool.query(
        `UPDATE reports 
         SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, 
             review_notes = $3, resolution_notes = $4
         WHERE id = $5
         RETURNING *`,
        [
          status,
          (req as AuthRequest).user!.id,
          reviewNotes || null,
          status === 'resolved' ? reviewNotes : null,
          reportId,
        ]
      );

      // Log activity
      const actionMap: Record<string, string> = {
        approved: 'report_approved',
        rejected: 'report_rejected',
        resolved: 'report_resolved',
        under_review: 'report_reviewing',
      };

      await pool.query(
        `INSERT INTO activity_logs (action, user_id, user_name, report_id, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          actionMap[status] || 'status_updated',
          (req as AuthRequest).user!.id,
          (req as AuthRequest).user!.name,
          reportId,
          `Report status changed to ${status}${reviewNotes ? `: ${reviewNotes}` : ''}`,
        ]
      );

      // Create notification for reporter
      const statusMessages: Record<string, string> = {
        approved: 'Your incident report has been approved.',
        rejected: 'Your incident report has been rejected.',
        resolved: 'Your incident report has been resolved.',
        under_review: 'Your incident report is now under review.',
      };

      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, related_report_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          report.reporter_id,
          `Report ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          statusMessages[status] || 'Your report status has been updated.',
          status === 'rejected' ? 'warning' : status === 'resolved' ? 'success' : 'info',
          reportId,
        ]
      );

      res.json({
        message: 'Report status updated',
        report: formatReport(result.rows[0]),
      });
    } catch (error: any) {
  console.error("CREATE REPORT ERROR:");
  console.error(error);

  res.status(500).json({
    error: error.message
  });
}
  }
);

// Helper function to format report
function formatReport(report: any) {
  return {
    id: report.id,
    reportNumber: report.report_number,
    reporterId: report.reporter_id,
    reporterName: report.reporter_name,
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    status: report.status,
    location: report.location,
    barangay: report.barangay,
    latitude: report.latitude,
    longitude: report.longitude,
    evidenceDescription: report.evidence_description,
    witnessName: report.witness_name,
    witnessContact: report.witness_contact,
    isAnonymous: report.is_anonymous,
    reviewedBy: report.reviewed_by,
    reviewedAt: report.reviewed_at,
    reviewNotes: report.review_notes,
    resolutionNotes: report.resolution_notes,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  };
}

export default router;
