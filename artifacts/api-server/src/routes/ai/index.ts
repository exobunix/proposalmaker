import { Router } from "express";
import {
  GenerateProposalContentBody,
  GenerateFullProposalBody,
  RewriteContentBody,
  UploadLogoBody,
} from "@workspace/api-zod";

import { requireAuth } from "../../middlewares/auth";
import { generateMockFullProposal } from "../../lib/mock-generator";

const router = Router();

async function generateGeminiJson(systemPrompt: string, prompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const combinedPrompt = `${systemPrompt}\n\nUser Request / Prompt:\n${prompt}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: combinedPrompt
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned error status ${response.status}: ${errorText}`);
  }

  const data = await response.json() as any;
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Invalid response format from Gemini API");
  }
  return JSON.parse(content.trim());
}

async function generateGeminiText(systemPrompt: string, prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const combinedPrompt = `${systemPrompt}\n\nUser Request / Prompt:\n${prompt}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: combinedPrompt
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned error status ${response.status}: ${errorText}`);
  }

  const data = await response.json() as any;
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Invalid response format from Gemini API");
  }
  return content;
}

router.use(requireAuth);

function buildSystemPrompt(contactDetails?: string): string {
  const companyName = contactDetails || "TechVision Solutions";
  return `You are an expert senior business proposal writer and enterprise digital architect representing the company "${companyName}".
Generate consulting-grade proposal content in structured JSON format. Avoid placeholder text or generic summaries. All content must be fully fleshed out, specific to the client's business challenge, and highly professional.
Whenever you refer to the company preparing this proposal, you MUST use "${companyName}" and NEVER use "TechVision Solutions" or other placeholder names.`;
}

// ─── AI Generation Pipeline ──────────────────────────────────────────────────

router.post("/generate-full-proposal", async (req, res) => {
  const parsed = GenerateFullProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { projectType, clientIndustry, clientName, projectName, budgetRange, additionalContext, contactDetails } =
    parsed.data;

  try {
    // ─── STAGE 1: Strategy Analysis & Industry/Theme Detection ───
    const analysisPrompt = `Analyze this project request and create a detailed business & tech strategy.
Project Type: ${projectType}
Client Industry: ${clientIndustry}
Client Name: ${clientName}
Project Name: ${projectName}
Budget: ${budgetRange || "Not specified"}
Context: ${additionalContext || "None"}

You MUST return a JSON object in this exact format:
{
  "theme": "Best match from: Healthcare, Fintech, Real Estate, Legal, Education, Technology, Manufacturing, Agriculture, IoT, Restaurant, Construction",
  "businessUnderstanding": "Thorough consulting-grade industry analysis",
  "competitors": "Competitor landscape summary",
  "architectureOverview": "Technical architecture overview",
  "techRecommendations": {
    "frontend": "Frontend language & framework",
    "backend": "Backend language & framework",
    "database": "Database type",
    "cloud": "Cloud provider & deployment target"
  },
  "phases": [
    { "name": "Sprint 1-2", "duration": "2 Weeks", "deliverables": "Specific tasks" }
  ],
  "costEstimation": {
    "total": "Total budget estimate",
    "breakdown": [
      { "item": "Development Phase", "cost": "$..." }
    ]
  },
  "risks": [
    { "risk": "Technical debt/Security risk", "mitigation": "Proper standard to resolve" }
  ]
}`;

    const strategy = await generateGeminiJson(buildSystemPrompt(contactDetails), analysisPrompt);
    const theme = strategy.theme || "Technology";

    // ─── STAGE 2: Batch Generation of 42 Sections ───
    // Batch 1: Intro & Business
    const batch1Prompt = `Generate proposal sections for: coverPage, confidentialPage, executiveSummary, businessUnderstanding, currentChallenges, painPoints, businessObjectives, proposedSolution, whyThisSolution.
Client: ${clientName}, Project: ${projectName}, Theme: ${theme}.
Strategy context: ${JSON.stringify(strategy)}
Return JSON with the keys matching the section name. Each section must be an object with a "type" (one of: rich-text, grid-cards, table, bullet-list, timeline, diagram-spec) and its data fields.
- coverPage: type "cover", fields: title, subtitle, client, date
- confidentialPage: type "rich-text", content
- executiveSummary: type "rich-text", content
- businessUnderstanding: type "rich-text", content
- currentChallenges: type "bullet-list", items
- painPoints: type "grid-cards", cards (title, desc, icon)
- businessObjectives: type "bullet-list", items
- proposedSolution: type "rich-text", content
- whyThisSolution: type "grid-cards", cards (title, desc, icon)`;

    // Batch 2: Technical Blueprint
    const batch2Prompt = `Generate proposal sections for: systemOverview, architectureDiagram, userFlow, technologyStack, projectModules, features, functionalRequirements, nonFunctionalRequirements, databaseDesign, apiArchitecture.
Client: ${clientName}, Project: ${projectName}, Theme: ${theme}.
Strategy context: ${JSON.stringify(strategy)}
Return JSON keys matching section names. 
- systemOverview: type "rich-text", content
- architectureDiagram: type "diagram-spec", format "architecture", data (array of layer objects: key, label, color, icon, text)
- userFlow: type "diagram-spec", format "userflow", data (array of step objects: step, label, desc)
- technologyStack: type "table", headers ["Layer", "Technology", "Description"], rows (array of arrays)
- projectModules: type "grid-cards", cards (title, desc, icon)
- features: type "grid-cards", cards (title, desc, icon)
- functionalRequirements: type "bullet-list", items
- nonFunctionalRequirements: type "bullet-list", items
- databaseDesign: type "table", headers ["Table Name", "Primary Key", "Description"], rows
- apiArchitecture: type "table", headers ["Endpoint", "Method", "Purpose"], rows`;

    // Batch 3: Delivery & Operations
    const batch3Prompt = `Generate proposal sections for: security, aiIntegration, thirdPartyIntegrations, developmentMethodology, sprintPlanning, timeline, milestones, teamStructure, testingStrategy, deployment, hosting, maintenance, support, training.
Client: ${clientName}, Project: ${projectName}, Theme: ${theme}.
Strategy context: ${JSON.stringify(strategy)}
Return JSON keys matching section names.
- security: type "rich-text", content
- aiIntegration: type "rich-text", content
- thirdPartyIntegrations: type "table", headers ["Service Name", "Type", "Integration Purpose"], rows
- developmentMethodology: type "rich-text", content
- sprintPlanning: type "table", headers ["Sprint", "Duration", "Core Focus"], rows
- timeline: type "timeline", items (phase, duration, deliverables)
- milestones: type "table", headers ["Milestone", "Target Week", "Sign-Off Criteria"], rows
- teamStructure: type "grid-cards", cards (title, desc, icon)
- testingStrategy: type "rich-text", content
- deployment: type "rich-text", content
- hosting: type "rich-text", content
- maintenance: type "rich-text", content
- support: type "rich-text", content
- training: type "rich-text", content`;

    // Batch 4: Financials & Agreement
    const batch4Prompt = `Generate proposal sections for: costEstimation, paymentMilestones, futureEnhancements, riskAnalysis, termsConditions, acceptanceCriteria, warranty, thankYou, signaturePage.
Client: ${clientName}, Project: ${projectName}, Theme: ${theme}.
Strategy context: ${JSON.stringify(strategy)}
Return JSON keys matching section names.
- costEstimation: type "table", headers ["Phase/Item", "Description", "Estimated Cost"], rows
- paymentMilestones: type "table", headers ["Milestone", "Percentage", "Trigger Event"], rows
- futureEnhancements: type "bullet-list", items
- riskAnalysis: type "table", headers ["Risk Event", "Impact Level", "Mitigation Strategy"], rows
- termsConditions: type "rich-text", content
- acceptanceCriteria: type "bullet-list", items
- warranty: type "rich-text", content
- thankYou: type "rich-text", content
- signaturePage: type "rich-text", content`;

    const [batch1, batch2, batch3, batch4] = await Promise.all([
      generateGeminiJson(buildSystemPrompt(contactDetails), batch1Prompt),
      generateGeminiJson(buildSystemPrompt(contactDetails), batch2Prompt),
      generateGeminiJson(buildSystemPrompt(contactDetails), batch3Prompt),
      generateGeminiJson(buildSystemPrompt(contactDetails), batch4Prompt)
    ]);

    // Compile into final 42 sections
    const compiledSections = {
      ...batch1,
      ...batch2,
      ...batch3,
      ...batch4
    };

    res.json(compiledSections);
  } catch (err: any) {
    req.log.error({ err }, "Failed to generate full proposal using AI, falling back to consulting template generator");
    try {
      const fallbackData = generateMockFullProposal(
        clientName,
        projectName,
        clientIndustry,
        projectType,
        budgetRange,
        additionalContext,
        contactDetails
      );
      res.json(fallbackData);
    } catch (fallbackErr: any) {
      res.status(500).json({
        error: "AI content generation failed and fallback failed",
        details: fallbackErr?.message || String(fallbackErr),
      });
    }
  }
});

router.post("/generate-content", async (req, res) => {
  const parsed = GenerateProposalContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const {
    section,
    projectType,
    clientIndustry,
    clientName,
    projectName,
    budgetRange,
    additionalContext,
    contactDetails,
  } = parsed.data;

  const singleSectionPrompt = `Generate a single structured proposal section for "${section}".
Project Type: ${projectType}
Client Industry: ${clientIndustry}
Client Name: ${clientName}
Project Name: ${projectName}
Budget: ${budgetRange || "Not specified"}
Context: ${additionalContext || "None"}

You MUST return a JSON object with keys "type" (one of: rich-text, grid-cards, table, bullet-list, timeline, diagram-spec) and its respective data fields matching that section type.`;

  try {
    const content = await generateGeminiJson(buildSystemPrompt(contactDetails), singleSectionPrompt);
    res.json({ content: JSON.stringify(content) });
  } catch (err: any) {
    req.log.error({ err }, "Failed to generate content using AI, falling back to mock generator");
    try {
      const fallbackData = generateMockFullProposal(
        clientName,
        projectName,
        clientIndustry,
        projectType,
        budgetRange,
        additionalContext,
        contactDetails
      );
      const sectionContent = fallbackData[section] || { type: "rich-text", content: `### ${section}\n\nFallback content template.` };
      res.json({ content: JSON.stringify(sectionContent) });
    } catch (fallbackErr: any) {
      res.status(500).json({ error: "AI content generation failed and fallback failed", details: fallbackErr?.message });
    }
  }
});

router.post("/rewrite", async (req, res) => {
  const parsed = RewriteContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { content, tone, section } = parsed.data;

  const toneInstructions: Record<string, string> = {
    professional:
      "Rewrite this in a polished, formal professional tone. Clear, authoritative, and corporate. Suitable for Fortune 500 clients. Maintain all detail and depth.",
    premium:
      "Rewrite this in an ultra-premium, luxury consulting tone. Sophisticated, elevated language that signals exclusivity and top-tier expertise. Like McKinsey meets Apple. Keep all details.",
    "startup-friendly":
      "Rewrite this in a confident, modern startup-friendly tone. Energetic, direct, and growth-focused. Less corporate, more visionary. Keep all details.",
  };

  const toneInstruction =
    toneInstructions[tone.toLowerCase()] ||
    `Rewrite this content in a ${tone} tone while maintaining all detail and depth.`;

  try {
    const prompt = `${toneInstruction}\n\nSection: ${section}\n\nOriginal content:\n${content}`;
    const rewritten = await generateGeminiText(buildSystemPrompt(), prompt);
    res.json({ content: rewritten });
  } catch (err) {
    req.log.error({ err }, "Failed to rewrite content using AI, falling back to local rewrite");
    try {
      // Local rewrite fallback logic
      let rewrittenStr = "";
      try {
        const data = JSON.parse(content);
        const adj = tone === "premium" ? "Premium Optimized" : tone === "startup-friendly" || tone === "startup" ? "Agile Scale" : "Corporate Standard";
        
        if (data.type === "rich-text" && data.content) {
          data.content = `### [${adj} Rewrite]\n\n` + data.content;
        } else if (data.type === "grid-cards" && data.cards) {
          data.cards = data.cards.map((c: any) => ({
            ...c,
            title: `${c.title} (${adj})`,
            desc: `[${adj} Version] ${c.desc}`
          }));
        } else if (data.type === "bullet-list" && data.items) {
          data.items = data.items.map((item: string) => `${item} (Optimized for ${adj})`);
        } else if (data.type === "timeline" && data.items) {
          data.items = data.items.map((item: any) => ({
            ...item,
            deliverables: `[${adj}] ${item.deliverables || item.desc}`
          }));
        }
        rewrittenStr = JSON.stringify(data);
      } catch (jsonErr) {
        const adj = tone === "premium" ? "leveraging elite industry methodologies" : tone === "startup-friendly" || tone === "startup" ? "focused on agile scaling dynamics" : "meeting rigorous corporate benchmarks";
        rewrittenStr = `### Optimized Content (${tone.toUpperCase()})\n\nThis section has been optimized ${adj}.\n\n${content}`;
      }
      res.json({ content: rewrittenStr });
    } catch (fallbackErr: any) {
      res.status(500).json({ error: "AI rewrite failed and fallback failed", details: fallbackErr?.message });
    }
  }
});

router.post("/upload-logo", async (req, res) => {
  const parsed = UploadLogoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
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
      res.json({ url: result.url });
      return;
    } catch (err) {
      req.log.error({ err }, "ImageKit upload failed, falling back to base64");
    }
  }

  const dataUrl = `data:${mimeType};base64,${base64Data}`;
  res.json({ url: dataUrl });
});

export default router;
