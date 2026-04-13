import { Router } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, proposalsTable } from "@workspace/db";
import {
  CreateProposalBody,
  UpdateProposalBody,
  GetProposalParams,
  UpdateProposalParams,
  DeleteProposalParams,
  DuplicateProposalParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const allProposals = await db
      .select()
      .from(proposalsTable)
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

router.get("/", async (req, res) => {
  try {
    const proposals = await db
      .select()
      .from(proposalsTable)
      .orderBy(desc(proposalsTable.createdAt));
    res.json(proposals);
  } catch (err) {
    req.log.error({ err }, "Failed to list proposals");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
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

router.get("/:id", async (req, res) => {
  const parsed = GetProposalParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [proposal] = await db
      .select()
      .from(proposalsTable)
      .where(eq(proposalsTable.id, parsed.data.id));

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.json(proposal);
  } catch (err) {
    req.log.error({ err }, "Failed to get proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
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
      .where(eq(proposalsTable.id, paramsParsed.data.id))
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

router.delete("/:id", async (req, res) => {
  const parsed = DeleteProposalParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    await db
      .delete(proposalsTable)
      .where(eq(proposalsTable.id, parsed.data.id));

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/duplicate", async (req, res) => {
  const parsed = DuplicateProposalParams.safeParse({
    id: Number(req.params.id),
  });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [original] = await db
      .select()
      .from(proposalsTable)
      .where(eq(proposalsTable.id, parsed.data.id));

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
