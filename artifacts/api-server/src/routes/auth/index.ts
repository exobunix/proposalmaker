import { Router } from "express";
import { User } from "@workspace/db";
import { hashPassword, verifyPassword, generateToken } from "../../lib/auth-utils";
import { requireAuth, type AuthenticatedRequest } from "../../middlewares/auth";

const router = Router();

router.get("/debug", async (req, res) => {
  try {
    let dbAccessible = false;
    let dbWriteable = false;
    let writeError = null;

    try {
      const testEmail = `test_${Date.now()}@debug.com`;
      await User.create({
        email: testEmail,
        password: "testpassword",
        subscription: "free"
      });
      dbAccessible = true;
      dbWriteable = true;
      await User.deleteOne({ email: testEmail });
    } catch (writeErr: any) {
      writeError = { message: writeErr.message, stack: writeErr.stack };
    }

    res.json({
      status: "online",
      cwd: process.cwd(),
      dbAccessible,
      dbWriteable,
      writeError,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL_SET: !!process.env.DATABASE_URL || !!process.env.MONGODB_URI,
        DATABASE_URL_VAL: (process.env.DATABASE_URL || process.env.MONGODB_URI) ? `${(process.env.DATABASE_URL || process.env.MONGODB_URI)!.substring(0, 15)}...` : undefined,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      subscription: "free",
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err: any) {
    req.log.error({ err }, "Registration error");
    res.status(500).json({
      error: "Internal server error",
      details: err?.message || String(err),
      code: err?.code,
      stack: err?.stack
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err: any) {
    req.log.error({ err }, "Login error");
    res.status(500).json({
      error: "Internal server error",
      details: err?.message || String(err),
      code: err?.code,
      stack: err?.stack
    });
  }
});

router.get("/me", requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
