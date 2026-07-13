import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken } from "../../lib/auth-utils";
import { requireAuth, type AuthenticatedRequest } from "../../middlewares/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()));

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        subscription: "free",
      })
      .returning();

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
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()));

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
