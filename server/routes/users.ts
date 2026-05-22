import { Router, Response, Request } from "express";
import pool from "../db/index.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

/**
 * GET all users (admin only)
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { role, search } = req.query;

      let whereConditions: string[] = [];
      let params: any[] = [];
      let i = 1;

      if (role && role !== "all") {
        whereConditions.push(`role = $${i}`);
        params.push(role);
        i++;
      }

      if (search) {
        whereConditions.push(`(
          name ILIKE $${i} OR 
          email ILIKE $${i} OR 
          phone ILIKE $${i}
        )`);
        params.push(`%${search}%`);
        i++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const result = await pool.query(
        `
        SELECT id, name, email, phone, address, barangay, role, is_verified, created_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        `,
        params
      );

      res.json({
        users: result.rows,
      });
    } catch (err) {
      console.error("GET USERS ERROR:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * PATCH verify user (admin only)
 */
router.patch(
  "/:id/verify",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { isVerified } = req.body;

      const result = await pool.query(
        `UPDATE users
         SET is_verified = $1
         WHERE id = $2
         RETURNING id, name, email, is_verified`,
        [isVerified, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "User updated",
        user: result.rows[0],
      });
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;