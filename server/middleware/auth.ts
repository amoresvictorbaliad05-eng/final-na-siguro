import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
    name?: string;
    role: string;
  };
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "Access denied. No token provided",
      });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: number;
      role: string;
      email?: string;
      name?: string;
    };

    authReq.user = decoded;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    res.status(403).json({
      error: "Invalid token",
    });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;

  if (
    !authReq.user ||
    (authReq.user.role !== "admin" &&
      authReq.user.role !== "superadmin")
  ) {
    res.status(403).json({
      error: "Admin access required",
    });
    return;
  }

  next();
};