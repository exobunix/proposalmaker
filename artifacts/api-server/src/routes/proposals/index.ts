import { Router } from "express";
import { Proposal } from "@workspace/db";
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
    const allProposals = await Proposal.find({ userId }).sort({ createdAt: -1 }).lean();

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
    const proposals = await Proposal.find({ userId }).sort({ createdAt: -1 }).lean();
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
    const currentCount = await Proposal.countDocuments({ userId });

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

    const proposal = await Proposal.create({
      ...parsed.data,
      userId,
      status: "draft",
      enabledSections: defaultEnabledSections,
    });

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
    const proposal = await Proposal.findOne({ id: parsed.data.id, userId }).lean();

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
    const proposal = await Proposal.findOneAndUpdate(
      { id: paramsParsed.data.id, userId },
      { $set: bodyParsed.data },
      { new: true }
    ).lean();

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
    const existing = await Proposal.findOne({ id: parsed.data.id, userId });

    if (!existing) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    await Proposal.deleteOne({ id: parsed.data.id });

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
    const currentCount = await Proposal.countDocuments({ userId });

    if (subscription === "free" && currentCount >= 3) {
      return res.status(403).json({
        error: "You have reached the limit of 3 free proposals. Please upgrade your subscription plan to duplicate or generate more.",
        limitExceeded: true,
      });
    }

    const original = await Proposal.findOne({ id: parsed.data.id, userId }).lean();

    if (!original) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    const { id, createdAt, updatedAt, _id, __v, ...rest } = original;
    const duplicate = await Proposal.create({
      ...rest,
      projectName: `${rest.projectName} (Copy)`,
      status: "draft",
    });

    res.status(201).json(duplicate);
  } catch (err) {
    req.log.error({ err }, "Failed to duplicate proposal");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
