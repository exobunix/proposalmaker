import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth-utils";
import { User } from "@workspace/db";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    subscription: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid authorization token format" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({ id: decoded.userId }).select("id email subscription");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      subscription: user.subscription,
    };
    next();
  } catch (err) {
    req.log.error({ err }, "Auth middleware database error");
    res.status(500).json({ error: "Internal server error" });
  }
}
