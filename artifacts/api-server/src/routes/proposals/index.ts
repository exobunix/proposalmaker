import { Router } from "express";
import { eq, and, desc, count } from "drizzle-orm";
import { db, proposalsTable } from "@workspace/db";
import {
  CreateProposalBody,
  UpdateProposalBody,
  GetProposalParams,
  UpdateProposalParams,
  DeleteProposalParams,
  DuplicateProposalParams,
} from "@workspace/api-zod";
import { requireAuth, type AuthenticatedRequest } from "../../middlewares/auth";

const router = Router();

// Protect all proposal routes
router.use(requireAuth);

router.get("/stats", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  try {
    const allProposals = await db
      .select()
      .from(proposalsTable)
      .where(eq(proposalsTable.userId, userId))
      .orderBy(desc(proposalsTable.createdAt));

    const total = allProposals.length;
    const draft = allProposals.filter((p) => p.status === "draft").length;
    const sent = allProposals.filter((p) => p.status === "sent").length;
    const approved = allProposals.filter((p) => p.status === "approved").length;
    const recentProposals = allProposals.slice(0, 5);

    res.json({ total, draft, sent, approved, recentProposals });
  } catch (err) {
    req.log.error({ err }, "Failed to get proposal stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  try {
    const proposals = await db
      .select()
      .from(proposalsTable)
      .where(eq(proposalsTable.userId, userId))
      .orderBy(desc(proposalsTable.createdAt));
    res.json(proposals);
  } catch (err) {
    req.log.error({ err }, "Failed to list proposals");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const subscription = req.user!.subscription;

  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // Check 3-proposal limit for free users
    const [countResult] = await db
      .select({ count: count() })
      .from(proposalsTable)
      .where(eq(proposalsTable.userId, userId));

    const currentCount = countResult?.count || 0;

    if (subscription === "free" && currentCount >= 3) {
      return res.status(403).json({
        error: "You have reached the limit of 3 free proposals. Please upgrade your subscription plan to generate more.",
        limitExceeded: true,
      });
    }

    const defaultEnabledSections = {
      executiveSummary: true,
      aboutCompany: true,
      projectOverview: true,
      features: true,
      technologyStack: true,
      pricing: true,
      digitalMarketing: true,
      addOns: true,
      legalTerms: true,
      acceptanceSection: true,
    };

    const [proposal] = await db
      .insert(proposalsTable)
      .values({
        ...parsed.data,
        userId,
        status: "draft",
        enabledSections: defaultEnabledSections,
      })
      .returning();

    res.status(201).json(proposal);
  } catch (err) {
    req.log.error({ err }, "Failed to create proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const parsed = GetProposalParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [proposal] = await db
      .select()
      .from(proposalsTable)
      .where(
        and(
          eq(proposalsTable.id, parsed.data.id),
          eq(proposalsTable.userId, userId)
        )
      );

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.json(proposal);
  } catch (err) {
    req.log.error({ err }, "Failed to get proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const paramsParsed = UpdateProposalParams.safeParse({
    id: Number(req.params.id),
  });
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const bodyParsed = UpdateProposalBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const [proposal] = await db
      .update(proposalsTable)
      .set({
        ...bodyParsed.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(proposalsTable.id, paramsParsed.data.id),
          eq(proposalsTable.userId, userId)
        )
      )
      .returning();

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.json(proposal);
  } catch (err) {
    req.log.error({ err }, "Failed to update proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const parsed = DeleteProposalParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [existing] = await db
      .select()
      .from(proposalsTable)
      .where(
        and(
          eq(proposalsTable.id, parsed.data.id),
          eq(proposalsTable.userId, userId)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    await db
      .delete(proposalsTable)
      .where(eq(proposalsTable.id, parsed.data.id));

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/duplicate", async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const subscription = req.user!.subscription;

  const parsed = DuplicateProposalParams.safeParse({
    id: Number(req.params.id),
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    // Check 3-proposal limit for free users
    const [countResult] = await db
      .select({ count: count() })
      .from(proposalsTable)
      .where(eq(proposalsTable.userId, userId));

    const currentCount = countResult?.count || 0;

    if (subscription === "free" && currentCount >= 3) {
      return res.status(403).json({
        error: "You have reached the limit of 3 free proposals. Please upgrade your subscription plan to duplicate or generate more.",
        limitExceeded: true,
      });
    }

    const [original] = await db
      .select()
      .from(proposalsTable)
      .where(
        and(
          eq(proposalsTable.id, parsed.data.id),
          eq(proposalsTable.userId, userId)
        )
      );

    if (!original) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    const { id, createdAt, updatedAt, ...rest } = original;
    const [duplicate] = await db
      .insert(proposalsTable)
      .values({
        ...rest,
        projectName: `${rest.projectName} (Copy)`,
        status: "draft",
      })
      .returning();

    res.status(201).json(duplicate);
  } catch (err) {
    req.log.error({ err }, "Failed to duplicate proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
