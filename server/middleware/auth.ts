import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthUser;

    req.user = decoded;

    next();

  } catch {
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (
    req.user?.role !== "admin" &&
    req.user?.role !== "superadmin"
  ) {
    res.status(403).json({
      error: "Admin access required",
    });

    return;
  }

  next();
};