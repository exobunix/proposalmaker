import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  GenerateProposalContentBody,
  GenerateFullProposalBody,
  RewriteContentBody,
  UploadLogoBody,
} from "@workspace/api-zod";

import { requireAuth } from "../../middlewares/auth";

const router = Router();

router.use(requireAuth);

const COMPANY_INFO = `
Company Name: TechVision Solutions
Founded: 2015
Headquarters: New York, NY
Services: Custom Software Development, Mobile App Development, SaaS Platforms, E-Commerce Solutions, Digital Transformation, Cloud Infrastructure
Team Size: 50+ professionals
Expertise: Full-stack development, AI/ML integration, scalable cloud architecture, enterprise software
Notable Clients: Fortune 500 companies and fast-growing startups
Awards: Top IT Consulting Firm 2023, Best Digital Transformation Partner 2022
`;

function buildSystemPrompt(): string {
  return `You are a senior business development consultant at a premium IT consulting firm. 
Your writing is concise, authoritative, and persuasive. You write in the style of top-tier consulting firms like McKinsey, Accenture, and Deloitte Digital.
Tone: Confident, professional, result-driven. Never use generic filler text. Make every sentence count.
Company information: ${COMPANY_INFO}`;
}

router.post("/generate-content", async (req, res) => {
  const parsed = GenerateProposalContentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const {
    section,
    projectType,
    clientIndustry,
    clientName,
    projectName,
    budgetRange,
    additionalContext,
  } = parsed.data;

  const sectionPrompts: Record<string, string> = {
    executiveSummary: `Write a compelling Executive Summary for a ${projectType} proposal for ${clientName} in the ${clientIndustry} industry. Project: ${projectName}. ${budgetRange ? `Budget: ${budgetRange}.` : ""} Write 3-4 powerful paragraphs that establish the problem, our solution, and the expected business impact. Be specific and persuasive.`,
    aboutCompany: `Write an "About Our Company" section for a proposal to ${clientName}. Highlight our expertise in ${projectType} development, our track record, team capabilities, and what makes us uniquely qualified to deliver this ${projectName} project. 3-4 paragraphs, confident and premium tone.`,
    projectOverview: `Write a detailed Project Overview for ${projectName} — a ${projectType} solution for ${clientName} in the ${clientIndustry} industry. Describe the solution architecture, core objectives, and how it will transform their business. Be technical yet accessible. 3-4 paragraphs.`,
    features: `Generate a comprehensive Features section for ${projectName} (${projectType}) for ${clientName}. List key modules with clear descriptions: User Panel features, Admin Panel features, and any relevant panels (Vendor Panel if marketplace, Driver Panel if logistics, etc.). Format as structured sections with feature names and descriptions. Make it comprehensive and impressive.`,
    technologyStack: `Recommend and explain the Technology Stack for ${projectName} (${projectType}) for ${clientName} in ${clientIndustry}. Cover: Frontend framework, Backend technology, Database, Cloud infrastructure, APIs & integrations, Security measures, DevOps/CI-CD. Explain why each choice is optimal for their use case.`,
    pricing: `Create a 3-tier pricing structure for ${projectName} (${projectType}) for ${clientName}. ${budgetRange ? `Client budget range: ${budgetRange}.` : ""} Tiers: Basic, Standard, Premium. For each tier, list included features, timeline estimate, and investment amount. Make pricing feel like value, not cost.`,
    digitalMarketing: `Write a Digital Marketing Strategy section for ${clientName}'s ${projectName}. Cover: Social Media Marketing (platforms, strategy, content plan), Paid Advertising (Google Ads, social ads, budget allocation), SEO Strategy (on-page, off-page, technical), Content Marketing, Analytics & KPI tracking. Be specific and strategic.`,
    addOns: `List premium Add-On services available for ${projectName} for ${clientName}. Include: SEO Package (with specific deliverables), UGC Video Production, Maintenance & Support Plans, Performance Optimization, Security Audits, Staff Training. Format each with a clear description and value proposition.`,
    legalTerms: `Write comprehensive Legal Terms & Conditions for a software development agreement between our firm and ${clientName} for ${projectName}. Cover: Intellectual Property Rights, Confidentiality, Payment Terms, Scope Changes, Warranties, Limitation of Liability, Termination Clause, Governing Law. Professional and protective of both parties.`,
    acceptanceSection: `Write an Acceptance & Sign-Off section for the proposal for ${clientName} regarding ${projectName}. Include: Agreement confirmation statement, spaces for client signature and date, spaces for our authorized representative signature and date, next steps after signing, contact information placeholder. Professional and clear.`,
  };

  const prompt =
    sectionPrompts[section] ||
    `Write a ${section} section for a ${projectType} proposal for ${clientName}.`;
  const fullPrompt = additionalContext
    ? `${prompt}\n\nAdditional context: ${additionalContext}`
    : prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: fullPrompt },
      ],
    });

    const content =
      response.choices[0]?.message?.content ?? "Content generation failed.";
    res.json({ content });
  } catch (err) {
    req.log.error({ err }, "Failed to generate content");
    res.status(500).json({ error: "AI content generation failed" });
  }
});

router.post("/generate-full-proposal", async (req, res) => {
  const parsed = GenerateFullProposalBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { projectType, clientIndustry, clientName, projectName, budgetRange, additionalContext } =
    parsed.data;

  const context = `Client: ${clientName}, Project: ${projectName}, Type: ${projectType}, Industry: ${clientIndustry}${budgetRange ? `, Budget: ${budgetRange}` : ""}${additionalContext ? `, Additional Context: ${additionalContext}` : ""}`;

  try {
    const generateSection = async (
      sectionName: string,
      prompt: string
    ): Promise<string> => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_completion_tokens: 2048,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: `${prompt}\n\nContext: ${context}` },
        ],
      });
      return (
        response.choices[0]?.message?.content ??
        `${sectionName} content generation failed.`
      );
    };

    const [
      executiveSummary,
      aboutCompany,
      projectOverview,
      features,
      technologyStack,
      pricing,
      digitalMarketing,
      addOns,
      legalTerms,
      acceptanceSection,
    ] = await Promise.all([
      generateSection(
        "Executive Summary",
        `Write a compelling 3-paragraph Executive Summary for a ${projectType} for ${clientName} in ${clientIndustry}. Focus on business impact and ROI.`
      ),
      generateSection(
        "About Company",
        `Write a 2-paragraph "About Our Company" section showcasing our expertise in building ${projectType} solutions for ${clientIndustry} clients.`
      ),
      generateSection(
        "Project Overview",
        `Write a 3-paragraph Project Overview for ${projectName}, a ${projectType} that will transform ${clientName}'s business in the ${clientIndustry} space.`
      ),
      generateSection(
        "Features",
        `List the key features and modules for ${projectName} (${projectType}). Include User Panel, Admin Panel, and any other relevant panels. Use clear headers and bullet points.`
      ),
      generateSection(
        "Technology Stack",
        `Recommend the optimal technology stack for ${projectName} (${projectType}). Cover frontend, backend, database, cloud, and integrations. Explain each choice briefly.`
      ),
      generateSection(
        "Pricing",
        `Create a 3-tier pricing structure (Basic/Standard/Premium) for ${projectName}. ${budgetRange ? `Client budget: ${budgetRange}.` : ""} Include features and estimated timelines per tier.`
      ),
      generateSection(
        "Digital Marketing",
        `Write a Digital Marketing strategy for ${clientName}'s ${projectName}. Cover social media, paid ads, SEO, and content marketing. Be specific and actionable.`
      ),
      generateSection(
        "Add-Ons",
        `List premium add-on services for ${projectName}: SEO package, UGC videos, maintenance plans, and other value-adding services. Include brief descriptions.`
      ),
      generateSection(
        "Legal Terms",
        `Write concise legal terms for a software development agreement for ${projectName}. Cover IP rights, confidentiality, payment terms, warranties, and termination.`
      ),
      generateSection(
        "Acceptance",
        `Write an Acceptance section for ${clientName}'s ${projectName} proposal. Include signature blocks, next steps after signing, and a professional closing statement.`
      ),
    ]);

    res.json({
      executiveSummary,
      aboutCompany,
      projectOverview,
      features,
      technologyStack,
      pricing,
      digitalMarketing,
      addOns,
      legalTerms,
      acceptanceSection,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to generate full proposal");
    res.status(500).json({ error: "AI content generation failed" });
  }
});

router.post("/rewrite", async (req, res) => {
  const parsed = RewriteContentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { content, tone, section } = parsed.data;

  const toneInstructions: Record<string, string> = {
    professional:
      "Rewrite this in a polished, formal professional tone. Clear, authoritative, and corporate. Suitable for Fortune 500 clients.",
    premium:
      "Rewrite this in an ultra-premium, luxury consulting tone. Sophisticated, elevated language that signals exclusivity and top-tier expertise. Like McKinsey meets Apple.",
    "startup-friendly":
      "Rewrite this in a confident, modern startup-friendly tone. Energetic, direct, and growth-focused. Less corporate, more visionary.",
  };

  const toneInstruction =
    toneInstructions[tone.toLowerCase()] ||
    `Rewrite this content in a ${tone} tone.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        {
          role: "user",
          content: `${toneInstruction}\n\nSection: ${section}\n\nOriginal content:\n${content}`,
        },
      ],
    });

    const rewritten =
      response.choices[0]?.message?.content ?? "Rewrite failed.";
    res.json({ content: rewritten });
  } catch (err) {
    req.log.error({ err }, "Failed to rewrite content");
    res.status(500).json({ error: "AI rewrite failed" });
  }
});

router.post("/upload-logo", async (req, res) => {
  const parsed = UploadLogoBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { base64Data, mimeType } = parsed.data;

  if (
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    try {
      const auth = Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      const apiResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: dataUrl,
          fileName: `upload_${Date.now()}`,
          folder: "/Proposal maker",
        }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        req.log.error({ errorText }, "ImageKit upload failed response");
        throw new Error(`ImageKit upload failed with status ${apiResponse.status}`);
      }

      const result = await apiResponse.json() as { url: string };
      return res.json({ url: result.url });
    } catch (err) {
      req.log.error({ err }, "ImageKit upload failed, falling back to base64");
    }
  }

  const dataUrl = `data:${mimeType};base64,${base64Data}`;
  res.json({ url: dataUrl });
});

export default router;
