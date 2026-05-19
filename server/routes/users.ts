import { Router, Response } from "express";
import pool from "../db/index";
import {
  authenticate,
  requireAdmin,
} from "../middleware/auth";

const router = Router();

// =============================================
// GET ALL USERS (ADMIN ONLY)
// =============================================

router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req, res: Response) => {
    try {
      const { role, search } = req.query;

      let whereConditions: string[] = [];
      let params: any[] = [];
      let paramIndex = 1;

      if (role && role !== "all") {
        whereConditions.push(`role = $${paramIndex}`);
        params.push(role);
        paramIndex++;
      }

      if (search) {
        whereConditions.push(`
          (
            name ILIKE $${paramIndex}
            OR email ILIKE $${paramIndex}
            OR phone ILIKE $${paramIndex}
          )
        `);

        params.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const result = await pool.query(
        `
        SELECT
        id,
        name,
        email,
        phone,
        address,
        barangay,
        role,
        is_verified,
        created_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        `,
        params
      );

      res.json({
        users: result.rows.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          barangay: user.barangay,
          role: user.role,
          isVerified: user.is_verified,
          createdAt: user.created_at,
        })),
      });

    } catch (error) {
      console.error("Get users error:", error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);


// =============================================
// VERIFY USER
// =============================================

router.patch(
  "/:id/verify",
  authenticate,
  requireAdmin,
  async (req, res: Response) => {
    try {
      const { isVerified } = req.body;

      const result = await pool.query(
        `
        UPDATE users
        SET is_verified=$1
        WHERE id=$2
        RETURNING id,name,email,is_verified
        `,
        [isVerified, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      res.json({
        message: `User ${
          isVerified ? "verified" : "unverified"
        } successfully`,
        user: result.rows[0],
      });

    } catch (error) {
      console.error("Verify user error:", error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

export default router;