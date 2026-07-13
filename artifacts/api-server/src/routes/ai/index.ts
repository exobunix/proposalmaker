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
Services: Custom Software Development, Mobile App Development, SaaS Platforms, E-Commerce Solutions, Digital Transformation, Cloud Infrastructure, AI/ML Integration
Team Size: 50+ professionals
Expertise: Full-stack development, AI/ML integration, scalable cloud architecture, enterprise software, real-time systems, performance optimization
Notable Clients: Fortune 500 companies and fast-growing startups across healthcare, fintech, retail, and logistics sectors
Awards: Top IT Consulting Firm 2023, Best Digital Transformation Partner 2022, ISO 27001 Certified
`;

function buildSystemPrompt(): string {
  return `You are an expert senior business proposal writer and digital consultant working for a premium IT firm.

Your proposals are renowned for being:
- Extremely detailed, comprehensive and thorough
- Written like a top-tier consulting firm (McKinsey, Deloitte Digital, Accenture)
- Rich with specific technical details, feature breakdowns, timelines, and business rationale
- Structured with clear headings, subheadings, bullet points, numbered lists, and tables
- Persuasive and ROI-focused — every section builds trust and closes the deal

FORMATTING RULES (strictly follow these):
- Use markdown formatting: ## for main headings, ### for subheadings, **bold** for key terms, - for bullets
- Include real, specific details — never write generic placeholder text
- Minimum 400-600 words per section unless specified otherwise
- Use tables where applicable (pricing, tech stack, timeline)
- Break up text with subheadings every 2-3 paragraphs
- Use numbered lists for sequential steps or ranked items
- Use bullet points for features, capabilities, or benefits
- Always end sections with a strong value statement or transition

Company information for "About Us" sections: ${COMPANY_INFO}`;
}

function buildSectionPrompts(
  projectType: string,
  clientIndustry: string,
  clientName: string,
  projectName: string,
  budgetRange?: string | null,
  additionalContext?: string | null
): Record<string, string> {
  const budget = budgetRange ? `Budget range: ${budgetRange}.` : "";
  const extra = additionalContext ? `\n\nAdditional Instructions from client: ${additionalContext}` : "";

  return {
    executiveSummary: `Write a comprehensive, detailed Executive Summary for a ${projectType} proposal for "${clientName}" in the ${clientIndustry} industry. Project name: "${projectName}". ${budget}

Include ALL of the following in your Executive Summary:
## Executive Summary

### The Opportunity
- Paint a vivid picture of the business challenge or opportunity "${clientName}" faces in today's ${clientIndustry} market
- Reference relevant industry trends, market statistics, and competitive pressures
- Explain the cost of inaction

### Our Proposed Solution
- Describe "${projectName}" as a transformative, tailor-made ${projectType} solution
- Highlight the 3-5 core pillars of the solution
- Explain how it directly addresses their specific challenges

### Why Choose Us
- Highlight our firm's unique qualifications for this project
- Reference relevant success stories and expertise

### Expected Business Impact
- List 4-6 specific, measurable outcomes (increase conversions by X%, reduce operational costs, etc.)
- ROI projection and timeline to break even
- Long-term strategic value

### Engagement Overview
- High-level timeline (e.g. 3-month delivery plan)
- Our collaborative approach
- Clear next steps after proposal acceptance

Write in a confident, premium consulting tone. Be specific to the ${clientIndustry} industry. Minimum 500 words.${extra}`,

    aboutCompany: `Write a detailed "About Our Company" section for a proposal to "${clientName}". This section must establish credibility, showcase expertise, and build trust.

Include ALL of the following:
## About TechVision Solutions

### Who We Are
- 2-3 paragraphs about our company mission, values, and approach to digital transformation
- Mention our founding story and growth trajectory
- Highlight our focus on building scalable, enterprise-grade ${projectType} solutions for ${clientIndustry} businesses

### Our Expertise
- Deep expertise in ${projectType} development
- List of core technical competencies (full-stack, cloud, AI/ML, security, integrations, etc.)
- Highlight ${clientIndustry}-specific knowledge

### Our Track Record
- Types of clients we've worked with (Fortune 500, high-growth startups)
- Range of projects delivered successfully
- Client retention rate and satisfaction metrics
- Awards and certifications

### Our Development Philosophy
- Agile methodology and iterative delivery
- Quality assurance and testing standards
- Post-launch support and partnership approach

### Why We're the Right Partner for ${clientName}
- Specific alignment between our expertise and this project's requirements
- Our commitment to on-time, on-budget delivery

Write in a proud, confident, premium tone. Minimum 450 words.${extra}`,

    projectOverview: `Write a highly detailed Project Overview for "${projectName}" — a ${projectType} solution for "${clientName}" in the ${clientIndustry} industry. ${budget}

Include ALL of the following:
## Project Overview

### Project Vision
- 2-paragraph description of the vision and purpose of "${projectName}"
- How it aligns with "${clientName}"'s strategic goals

### Problem Statement
- Describe the specific challenges in ${clientIndustry} that this project solves
- Current pain points (manual processes, poor user experience, scalability issues, etc.)
- Business impact of these problems

### Proposed Solution Architecture
- High-level description of the system and its core components
- How different modules integrate with each other
- Key technical decisions and their rationale

### Core Objectives
List 5-8 specific, measurable project objectives:
1. [Objective with measurable outcome]
(continue for all objectives...)

### Scope of Work
- What is included in this engagement
- Platform(s) covered (web, mobile, admin panel, API, etc.)
- Integrations to be built

### Out of Scope
- What is explicitly not included to manage expectations

### Project Timeline Overview
| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Discovery & Planning | 2 weeks | ... |
(include all phases)

Write with deep technical and business insight. Minimum 500 words.${extra}`,

    features: `Write an extremely comprehensive Features section for "${projectName}" (${projectType}) for "${clientName}" in ${clientIndustry}. This should be the most detailed section of the proposal.

Format as follows:
## Key Features & Modules

### 1. User Panel / Customer-Facing Interface
#### [Feature Group Name]
- **Feature Name**: Detailed description of what this feature does, why it matters, and how it works
(List 8-12 features with detailed descriptions)

### 2. Admin Panel / Back-Office Dashboard
#### [Admin Feature Group]
- **Feature Name**: Description
(List 8-10 admin features)

### 3. [Third Panel if applicable — Vendor, Driver, Agent, etc.]
(If it's a marketplace, add vendor panel; if logistics, add driver panel; if SaaS, add enterprise admin; customize for the industry)

### 4. Advanced Platform Features
- **Real-Time Notifications**: Push, email, and SMS notification system for all user actions
- **Analytics Dashboard**: Track KPIs, user behavior, revenue metrics with visual charts
- **Search & Filters**: Advanced search with multi-faceted filters, sorting, and saved searches
- **Multi-language Support**: Full localization framework for international expansion
- **Payment Gateway Integration**: Multiple payment methods — credit/debit cards, UPI, wallets, bank transfers
- **Security & Compliance**: Two-factor authentication, role-based access control, GDPR/data compliance
- **API & Webhooks**: RESTful API for third-party integrations and webhook support for real-time events
- **Mobile Responsive Design**: Fully responsive interface optimized for all screen sizes

### 5. AI & Automation Features
(List relevant AI features for the project type and industry)

### 6. Reporting & Analytics
(Detail reporting capabilities)

Be extremely specific and detailed. Minimum 600 words. Tailor every feature to the ${clientIndustry} industry.${extra}`,

    technologyStack: `Write a detailed Technology Stack section for "${projectName}" (${projectType}) for "${clientName}" in ${clientIndustry}.

Format as follows:
## Technology Stack

### Overview
- 1-2 paragraphs explaining our technology selection philosophy and how choices were made for this specific project

### Frontend Development
| Technology | Purpose | Why We Chose It |
|-----------|---------|----------------|
| React.js / Next.js | UI Framework | Server-side rendering, SEO, performance |
(add all frontend technologies)

### Backend Development
| Technology | Purpose | Why We Chose It |
|-----------|---------|----------------|
(list all backend technologies with reasoning)

### Database Architecture
| Database | Type | Use Case |
|---------|------|---------|
(list primary database, cache layer, search engine if applicable)

### Cloud Infrastructure & DevOps
| Service | Provider | Purpose |
|--------|---------|--------|
(AWS/GCP/Azure services, CI/CD, monitoring)

### Third-Party Integrations
- **Payment**: Stripe / Razorpay / PayPal
- **Communication**: Twilio (SMS), SendGrid (Email), Firebase (Push)
- **Maps**: Google Maps API
- **Analytics**: Google Analytics, Mixpanel
(list all relevant integrations for the project type)

### Security Architecture
- SSL/TLS encryption, data encryption at rest
- OWASP Top 10 compliance
- Regular security audits and penetration testing
(expand with project-specific security measures)

### Performance & Scalability
- Expected load handling capacity
- Horizontal scaling strategy
- Caching strategy and CDN usage
- Expected uptime SLA

Write with technical depth and business justification. Minimum 450 words.${extra}`,

    pricing: `Write a comprehensive Investment & Pricing section for "${projectName}" (${projectType}) for "${clientName}". ${budget}

Format as follows:
## Investment & Pricing

### Investment Philosophy
- 1 paragraph explaining our value-based pricing approach and what the investment covers

### Package Options

---

## 🥉 Starter Package
**Investment: [Price based on budget range or standard market rate]**
**Timeline: X-Y weeks**

#### Included Features:
(List 8-12 core features included in this package)

#### Technical Scope:
- Platforms: Web + Mobile (iOS & Android) / Web only
- Tech stack summary
- Number of user roles

#### What's Included:
- Design (UI/UX wireframes, mockups, final designs)
- Development (frontend, backend, database)
- Testing (unit, integration, UAT)
- Deployment (staging + production)
- Documentation (technical + user)
- Post-launch support: 30 days

---

## 🥈 Professional Package ⭐ RECOMMENDED
**Investment: [Price — 40-60% more than Starter]**
**Timeline: X-Y weeks**

#### Includes Everything in Starter PLUS:
(List 6-10 additional features)

- Post-launch support: 60 days
- Priority support response

---

## 🥇 Enterprise Package
**Investment: [Price — 80-120% more than Starter]**
**Timeline: X-Y weeks**

#### Includes Everything in Professional PLUS:
(List 6-8 premium add-ons)

- Post-launch support: 90 days
- Dedicated account manager
- Monthly performance reports

---

### Payment Terms
- 30% upfront upon project commencement
- 40% at mid-project milestone (design approval / beta launch)
- 30% upon final delivery and sign-off

### What's Included Across All Packages
- Source code ownership transferred to client
- Staging environment for testing
- Production-ready deployment
- Complete project documentation
- Knowledge transfer sessions

Tailor pricing to the ${clientIndustry} industry. Be specific with features in each tier. Minimum 450 words.${extra}`,

    digitalMarketing: `Write an extremely detailed Digital Marketing Strategy section for "${clientName}"'s "${projectName}" in the ${clientIndustry} industry.

Format as follows:
## Digital Marketing Strategy

### Marketing Overview
- Strategic approach aligned with ${clientIndustry} market dynamics
- Target audience definition and personas

### 1. Search Engine Optimization (SEO)
#### Technical SEO
- Site structure, URL optimization, schema markup
- Core Web Vitals optimization, page speed

#### On-Page SEO
- Keyword research and mapping strategy
- Content optimization approach
- Meta tags, headings, internal linking strategy

#### Off-Page SEO
- Link building strategy
- Digital PR and brand mentions

**Expected Timeline**: 3-6 months to first-page rankings
**Target Keywords**: (list example keywords relevant to their business)

### 2. Social Media Marketing
| Platform | Target Audience | Content Strategy | Posting Frequency |
|---------|----------------|-----------------|------------------|
| Instagram | ... | ... | ... |
| Facebook | ... | ... | ... |
| LinkedIn | ... | ... | ... |
(add relevant platforms for the ${clientIndustry})

#### Content Strategy
- Content pillars and themes
- Visual identity guidelines
- Community management approach

### 3. Paid Advertising (PPC)
#### Google Ads
- Search campaigns targeting high-intent keywords
- Display retargeting campaigns
- Performance Max campaigns

#### Social Media Ads
- Facebook/Instagram advertising strategy
- Budget allocation and expected ROAS
- A/B testing framework

**Recommended Monthly Ad Budget**: ₹X - ₹Y / $X - $Y

### 4. Content Marketing
- Blog strategy with 2-4 posts/week
- Video content plan
- Case studies and testimonials
- Email newsletter strategy

### 5. Analytics & KPI Framework
| KPI | Target | Measurement Tool |
|----|-------|-----------------|
| Organic Traffic | +X% MoM | Google Analytics |
| Conversion Rate | X% | ... |
(list 6-8 KPIs)

### 6. 90-Day Marketing Launch Plan
- Month 1: Foundation (setup, audit, content creation)
- Month 2: Execution (campaigns live, content publishing)
- Month 3: Optimization (data analysis, budget reallocation)

Minimum 550 words. Be specific to the ${clientIndustry} industry.${extra}`,

    addOns: `Write a detailed Optional Add-On Services section for "${projectName}" for "${clientName}" in ${clientIndustry}.

Format as follows:
## Optional Add-On Services

### Overview
Brief intro paragraph about how these add-ons can amplify the impact of "${projectName}".

---

### 📦 Add-On 1: Advanced SEO Package
**Investment: ₹XX,XXX / month (3-month minimum)**

**What's Included:**
- Comprehensive technical SEO audit
- 8 SEO-optimized blog articles/month (1500+ words each)
- Guest posting and link building (5 high-DA links/month)
- Weekly ranking reports and monthly strategy calls
- Local SEO optimization (Google My Business)

**Expected ROI**: 200-400% organic traffic increase within 6 months

---

### 🎬 Add-On 2: UGC & Video Content Production
**Investment: ₹XX,XXX per package**

**What's Included:**
- 10 professional UGC-style videos (30-60 seconds each)
- 4 long-form YouTube/explainer videos
- 20 Instagram Reels / TikTok-style short videos
- Professional voiceover and subtitles
- Platform-specific optimization

**Best For**: E-commerce brands, consumer apps, local businesses wanting viral content

---

### 🔧 Add-On 3: Premium Maintenance & Support Plan
**Investment: ₹XX,XXX / month**

**What's Included:**
- 24/7 uptime monitoring with instant alerts
- Up to 40 hours of bug fixes and updates/month
- Monthly performance optimization report
- Database backups (daily automated + 30-day retention)
- Security patches and dependency updates
- Quarterly feature enhancements
- Dedicated support Slack channel

---

### 🚀 Add-On 4: Performance Optimization Package
**Investment: ₹XX,XXX (one-time)**

**What's Included:**
- Complete codebase audit and refactoring
- Database query optimization (50%+ speed improvement)
- CDN setup and configuration
- Image compression and lazy loading
- PageSpeed score improvement to 90+
- Load testing up to 10,000 concurrent users

---

### 🔒 Add-On 5: Security Audit & Penetration Testing
**Investment: ₹XX,XXX (quarterly)**

**What's Included:**
- Full OWASP Top 10 vulnerability assessment
- Penetration testing by certified security engineers
- Detailed security report with remediation plan
- Fix implementation for identified vulnerabilities
- ISO 27001 compliance consultation

---

### 📊 Add-On 6: Business Intelligence & Custom Reporting
**Investment: ₹XX,XXX (one-time setup) + ₹X,XXX/month**

**What's Included:**
- Custom BI dashboard (Power BI or Tableau)
- Real-time sales and operations reporting
- Predictive analytics using historical data
- Automated weekly/monthly PDF reports to stakeholders

Minimum 450 words. Tailor add-ons to ${clientIndustry}.${extra}`,

    legalTerms: `Write comprehensive Terms & Conditions for a software development agreement for "${projectName}" between our firm and "${clientName}".

Format as follows:
## Terms & Conditions

*This Software Development Agreement ("Agreement") is entered into between TechVision Solutions ("Service Provider") and ${clientName} ("Client") for the development of ${projectName}.*

---

### 1. Scope of Work
1.1 The Service Provider agrees to design, develop, test, and deploy "${projectName}" as described in this proposal document.
1.2 Any work outside the agreed scope will be treated as a change request and priced separately.
1.3 All features and specifications are as documented in the Scope of Work section of this proposal.

### 2. Intellectual Property Rights
2.1 Upon receipt of final payment, all intellectual property, including source code, designs, and documentation, shall be transferred to the Client.
2.2 The Service Provider retains the right to showcase the project in their portfolio unless explicitly requested otherwise in writing.
2.3 The Client warrants that any materials, logos, or content provided do not infringe third-party intellectual property rights.

### 3. Payment Terms & Conditions
3.1 **Payment Schedule**: 30% upfront, 40% at mid-project milestone, 30% upon final delivery.
3.2 Payments are due within 7 business days of invoice issuance.
3.3 A late payment fee of 2% per month applies to overdue invoices.
3.4 Work will pause if payment is more than 14 days overdue until the outstanding balance is cleared.
3.5 All prices are exclusive of applicable taxes (GST/VAT).

### 4. Project Timeline & Milestones
4.1 The project timeline is contingent upon timely feedback and approvals from the Client.
4.2 Delays caused by the Client's failure to provide timely feedback (more than 5 business days) may extend the project timeline accordingly.
4.3 The Service Provider will provide weekly status updates via agreed communication channels.

### 5. Change Requests & Scope Modifications
5.1 Any changes to the agreed scope of work must be submitted in writing.
5.2 The Service Provider will assess the impact on timeline and cost within 3 business days.
5.3 No additional work will commence without written approval and, if applicable, payment for the change request.

### 6. Confidentiality
6.1 Both parties agree to keep all confidential information, business data, and trade secrets strictly private.
6.2 Neither party will disclose confidential information to third parties without prior written consent.
6.3 This confidentiality obligation survives termination of the Agreement for a period of 3 years.

### 7. Warranties & Representations
7.1 The Service Provider warrants that the delivered software will function as specified for 30/60/90 days post-launch (per chosen package).
7.2 During the warranty period, bugs and errors will be fixed at no additional cost.
7.3 The warranty does not cover issues caused by third-party services, unauthorized modifications, or misuse.

### 8. Limitation of Liability
8.1 The Service Provider's total liability under this Agreement shall not exceed the total fees paid by the Client.
8.2 Neither party shall be liable for indirect, incidental, or consequential damages.

### 9. Termination
9.1 Either party may terminate this Agreement with 30 days written notice.
9.2 Upon termination, the Client shall pay for all work completed to date.
9.3 The Service Provider will deliver all completed work and assets upon receipt of outstanding payments.

### 10. Governing Law
10.1 This Agreement shall be governed by the laws of [Jurisdiction].
10.2 Any disputes shall first be addressed through mediation before litigation.

### 11. Force Majeure
Neither party shall be liable for delays caused by circumstances beyond their reasonable control, including natural disasters, government actions, or internet infrastructure failures.

Minimum 500 words.${extra}`,

    acceptanceSection: `Write a formal, professional Acceptance & Sign-Off section for "${clientName}"'s "${projectName}" proposal.

Format as follows:
## Acceptance & Agreement

### Moving Forward Together

We are excited about the opportunity to partner with ${clientName} on "${projectName}". This proposal represents our commitment to delivering a world-class ${projectType} solution that will transform your business in the ${clientIndustry} space.

### Next Steps After Acceptance

Upon signing this proposal, we will immediately initiate the following:

**Week 1: Project Kickoff**
1. Sign the formal Software Development Agreement
2. Process the initial 30% payment to reserve your project slot
3. Schedule the Project Kickoff meeting with key stakeholders
4. Assign your dedicated project team (Project Manager, Lead Developer, UI/UX Designer)

**Week 1-2: Discovery Phase**
5. Conduct detailed requirements gathering sessions
6. Review existing systems, branding, and technical infrastructure
7. Finalize the project scope, wireframes, and technical architecture document
8. Set up project management tools and communication channels (Slack, Jira/Notion)

**Week 2-3: Design Phase Begins**
9. Deliver initial UI/UX wireframes for feedback
10. Begin brand identity alignment and design system creation

### Our Promise to You

We commit to:
- ✅ Weekly progress updates every Monday
- ✅ 24-hour response time to all queries during business hours
- ✅ Transparent communication about any challenges or changes
- ✅ On-time, on-budget delivery as agreed
- ✅ Quality that exceeds your expectations

### Proposal Validity

*This proposal is valid for **30 days** from the date of issue. Pricing and timelines are subject to revision after this period.*

---

### Client Acceptance

By signing below, ${clientName} agrees to the terms, scope, timeline, and investment outlined in this proposal.

**Client:**

Full Name: ___________________________________

Title/Designation: ____________________________

Company: ${clientName}

Signature: ___________________________________

Date: _______________________________________

---

**Service Provider:**

Full Name: ___________________________________

Title/Designation: Authorized Representative

Company: TechVision Solutions

Signature: ___________________________________

Date: _______________________________________

---

*We look forward to building something extraordinary together. Let's make "${projectName}" a landmark project in the ${clientIndustry} industry.*

**Questions? Contact us:**
📧 hello@techvisionsolutions.com
📞 +1 (800) 555-0100
🌐 www.techvisionsolutions.com

Minimum 350 words.${extra}`,
  };
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

  const sectionPrompts = buildSectionPrompts(
    projectType, clientIndustry, clientName, projectName, budgetRange, additionalContext
  );

  const prompt =
    sectionPrompts[section] ||
    `Write a highly detailed, comprehensive ${section} section for a ${projectType} proposal for ${clientName} in the ${clientIndustry} industry. Project: ${projectName}. Use markdown formatting with headings, subheadings, bullet points and tables. Minimum 400 words.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 4096,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
    });

    const content =
      response.choices[0]?.message?.content ?? "Content generation failed.";
    res.json({ content });
  } catch (err: any) {
    req.log.error({ err }, "Failed to generate content");
    res.status(500).json({ error: "AI content generation failed", details: err?.message });
  }
});

router.post("/generate-full-proposal", async (req, res) => {
  const parsed = GenerateFullProposalBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { projectType, clientIndustry, clientName, projectName, budgetRange, additionalContext } =
    parsed.data;

  const sectionPrompts = buildSectionPrompts(
    projectType, clientIndustry, clientName, projectName, budgetRange, additionalContext
  );

  try {
    const generateSection = async (
      sectionName: string,
      prompt: string
    ): Promise<string> => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          max_completion_tokens: 4096,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: prompt },
          ],
        });
        return (
          response.choices[0]?.message?.content ??
          `${sectionName} content generation failed.`
        );
      } catch (sectionErr: any) {
        req.log.error({ sectionErr, sectionName }, "Failed to generate section");
        return `Failed to generate this section. Error: ${sectionErr.message || sectionErr}. Please try generating this section individually using the AI button.`;
      }
    };

    const executiveSummary = await generateSection("Executive Summary", sectionPrompts.executiveSummary);
    const aboutCompany = await generateSection("About Company", sectionPrompts.aboutCompany);
    const projectOverview = await generateSection("Project Overview", sectionPrompts.projectOverview);
    const features = await generateSection("Features", sectionPrompts.features);
    const technologyStack = await generateSection("Technology Stack", sectionPrompts.technologyStack);
    const pricing = await generateSection("Pricing", sectionPrompts.pricing);
    const digitalMarketing = await generateSection("Digital Marketing", sectionPrompts.digitalMarketing);
    const addOns = await generateSection("Add-Ons", sectionPrompts.addOns);
    const legalTerms = await generateSection("Legal Terms", sectionPrompts.legalTerms);
    const acceptanceSection = await generateSection("Acceptance", sectionPrompts.acceptanceSection);

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
  } catch (err: any) {
    req.log.error({ err }, "Failed to generate full proposal");
    res.status(500).json({
      error: "AI content generation failed",
      details: err?.message || String(err),
    });
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 4096,
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
