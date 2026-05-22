import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: number;
  role: string;
  email?: string;
  name?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Generate JWT token
 */
export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d"
    }
  );
};

/**
 * Authenticate user
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "No token provided"
      });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({
        error: "Server configuration error"
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as AuthUser;

    (req as any).user = decoded;

    next();

  } catch (err) {
    console.error("Authentication error:", err);

    res.status(403).json({
      error: "Invalid token"
    });
  }
};

/**
 * Admin middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  if (
    !authReq.user ||
    (
      authReq.user.role !== "admin" &&
      authReq.user.role !== "superadmin"
    )
  ) {
    res.status(403).json({
      error: "Admin access required"
    });

    return;
  }

  next();
};