export function generateMockFullProposal(
  clientName: string,
  projectName: string,
  clientIndustry: string,
  projectType: string,
  budgetRange: string,
  additionalContext: string,
  contactDetails: string
): Record<string, any> {
  const budget = budgetRange || "$150,000";
  const industry = clientIndustry || "Technology";
  const project = projectName || "Enterprise Digital Overhaul";

  // Build high-quality templates
  return {
    coverPage: {
      type: "cover",
      title: project,
      client: clientName,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    },
    confidentialPage: {
      type: "rich-text",
      content: `### Confidentiality Agreement & Proprietary Information Notice

This document contains proprietary and confidential information of **${contactDetails || "TechVision Solutions"}** and **${clientName}**. 
By accepting this proposal, the recipient agrees that they will not disclose, duplicate, or distribute any of the concepts, designs, pricing, or strategic blueprints outlined herein to any third parties without prior written consent from ${contactDetails || "TechVision Solutions"}.

All technical diagrams, user flows, database structures, and cost estimations remain the intellectual property of ${contactDetails || "TechVision Solutions"} until a formal contract is executed and payment is received.`
    },
    executiveSummary: {
      type: "rich-text",
      content: `### Executive Summary: Transforming ${clientName}'s Digital Capability

In today's fast-moving market, modernizing operations is no longer optional. This proposal outlines the strategic blueprint to deliver **${project}**, custom-engineered to solve the operational bottlenecks in the **${industry}** sector.

Our proposed system is a secure, scalable, and responsive digital solution built on modern technology principles. By integrating standard cloud infrastructures and AI-driven automation, we will increase efficiency, eliminate manual operational overhead, and position **${clientName}** as an industry leader. We target a comprehensive rollout within a structured timeline, backed by robust security protocols and standard ISO compliance.`
    },
    businessUnderstanding: {
      type: "rich-text",
      content: `### Deep Business Understanding: The ${industry} Challenge

The **${industry}** sector is undergoing rapid digital changes. Businesses face challenges such as fragmented user experiences, manual data pipelines, and strict compliance constraints.

Through our initial analysis of **${clientName}**'s requirements, we identified critical needs:
1. **Seamless Scalability**: Supporting growing client interaction without degradation of service.
2. **Unified Data Intelligence**: Bridging legacy data silos to unlock real-time dashboard analytics.
3. **Optimized Compliance**: Aligning system flows with modern data privacy frameworks (GDPR, HIPAA, or SOC2 as applicable).`
    },
    currentChallenges: {
      type: "bullet-list",
      items: [
        "Inability to scale infrastructure dynamically during high-traffic client requests.",
        "Manual data entry and reconciliation across legacy tracking systems.",
        "Lack of unified dashboards resulting in delayed business intelligence reports.",
        "Potential compliance risks due to aging data encryption and storage protocols.",
        "High operational maintenance costs associated with outdated server architectures."
      ]
    },
    painPoints: {
      type: "grid-cards",
      cards: [
        {
          title: "System Bottlenecks",
          desc: "Current backend limits response speed under concurrent user loads.",
          icon: "speed",
          variant: "callout"
        },
        {
          title: "Data Silos",
          desc: "Valuable business data is trapped across multiple offline sheets.",
          icon: "data",
          variant: "info"
        },
        {
          title: "Security Gaps",
          desc: "Older encryption models require immediate update to industry standards.",
          icon: "security",
          variant: "highlight"
        },
        {
          title: "High Maintenance",
          desc: "Legacy systems demand manual maintenance tasks, driving up IT costs.",
          icon: "chart",
          variant: "stat"
        }
      ]
    },
    businessObjectives: {
      type: "bullet-list",
      items: [
        "Improve backend performance and achieve 99.9% uptime during peak loads.",
        "Automate 90% of manual data entry pipelines via custom integration connectors.",
        "Implement end-to-end data encryption in transit and at rest.",
        "Reduce monthly server and system maintenance overhead by 35% through serverless deployments."
      ]
    },
    proposedSolution: {
      type: "rich-text",
      content: `### The Proposed Solution: Next-Generation Digital Ecosystem

To address these challenges, we propose a custom-architected **${project}** ecosystem. This solution consists of:
- **Responsive Web Portal / Mobile Interface**: A premium React-based frontend designed for ease-of-use and high conversion.
- **Microservices API Layer**: A robust Node.js backend handling secure data transactions, authentication, and integration triggers.
- **Dynamic Cloud Database**: A hybrid PostgreSQL database offering fast indexing, high read/write speeds, and compliance standard safety.`
    },
    whyThisSolution: {
      type: "grid-cards",
      cards: [
        {
          title: "Proven Stack",
          desc: "Built using React, Node.js, and PostgreSQL for maximum security and community support.",
          icon: "cloud",
          variant: "info"
        },
        {
          title: "Scalable Architecture",
          desc: "Designed using microservices to scale independent modules under heavy traffic.",
          icon: "team",
          variant: "highlight"
        },
        {
          title: "AI Integration",
          desc: "Includes native smart workflows to predict bottlenecks and automate operations.",
          icon: "ai",
          variant: "callout"
        }
      ]
    },
    systemOverview: {
      type: "rich-text",
      content: `### High-Level System Architecture & Flow

The system is designed with a modern decoupled structure, separating presentation, business logic, and database persistence layers. 

All external requests pass through an API Gateway, which provides rate-limiting, OAuth2 validation, and request logging. Internal services communicate via a secure message broker, ensuring that heavy operations (like report generation or image compilation) do not impact the core user experience.`
    },
    architectureDiagram: {
      type: "diagram-spec",
      format: "architecture",
      data: [
        { key: "1", label: "Presentation Layer", color: "#3B82F6", icon: "mobile", text: "React/Next.js Client App (Tailwind CSS)" },
        { key: "2", label: "Gateway Layer", color: "#8B5CF6", icon: "security", text: "Reverse Proxy & API Gateways (OAuth 2.0 / JWT)" },
        { key: "3", label: "Application Services", color: "#10B981", icon: "ai", text: "Node.js/Express Microservices (AI Engine, Reporting, Auth)" },
        { key: "4", label: "Persistence Layer", color: "#F59E0B", icon: "data", text: "PostgreSQL Database Cluster + Redis Cache Layer" }
      ]
    },
    userFlow: {
      type: "diagram-spec",
      format: "userflow",
      data: [
        { step: 1, label: "Authentication Gate", desc: "User connects securely via Single Sign-On (SSO) with Multi-Factor authentication." },
        { step: 2, label: "Interactive Dashboard", desc: "User views real-time data widgets and custom intelligence pipelines." },
        { step: 3, label: "Operation Submission", desc: "User triggers actions (e.g. data export, process execution) which queue on the backend." },
        { step: 4, label: "Result Delivery", desc: "System returns instant confirmation and saves detailed logs to the database." }
      ]
    },
    technologyStack: {
      type: "table",
      headers: ["Layer", "Technology Selection", "Strategic Benefit"],
      rows: [
        ["Frontend UI", "React.js / TypeScript / TailwindCSS", "Provides highly interactive UI with rapid rendering speed."],
        ["Backend Core", "Node.js / Express.js / Bun", "Asynchronous, fast processing handling high concurrent request speeds."],
        ["Database", "PostgreSQL / Redis Cache", "Relational database integrity coupled with sub-millisecond memory caching."],
        ["Infrastructure", "Docker / AWS ECS / Cloudflare", "Containerized deployment providing auto-scaling and DDoS safety."]
      ]
    },
    projectModules: {
      type: "grid-cards",
      cards: [
        {
          title: "User Management",
          desc: "Handles registration, corporate directory sync, and role-based permissions.",
          icon: "team",
          variant: "info"
        },
        {
          title: "Process Automator",
          desc: "Manages backend cron jobs, integration hooks, and report generation queues.",
          icon: "ai",
          variant: "callout"
        },
        {
          title: "Reporting Engine",
          desc: "Compiles deep business analytics and formats clean print-ready PDFs.",
          icon: "chart",
          variant: "highlight"
        }
      ]
    },
    features: {
      type: "grid-cards",
      cards: [
        {
          title: "Secure Single Sign-On",
          desc: "Full integration with corporate SAML / OAuth 2.0 identity directories.",
          icon: "security",
          variant: "info"
        },
        {
          title: "Real-time Metrics",
          desc: "Live websocket feeds showing system and business health dashboards.",
          icon: "chart",
          variant: "stat"
        },
        {
          title: "Smart Automations",
          desc: "Underlying intelligence pipelines to pre-populate form fields.",
          icon: "ai",
          variant: "callout"
        }
      ]
    },
    functionalRequirements: {
      type: "bullet-list",
      items: [
        "Users must be able to log in securely using corporate single sign-on credentials.",
        "The system must offer a responsive navigation dashboard working on mobile and desktop.",
        "Administrators must be able to edit user roles, grant permissions, and view system audits.",
        "The platform must generate exportable PDF and CSV reports for all dashboard views."
      ]
    },
    nonFunctionalRequirements: {
      type: "bullet-list",
      items: [
        "Performance: API responses must return in less than 200ms under standard loads.",
        "Security: All user data must be encrypted using AES-256 and TLS 1.3.",
        "Scalability: Infrastructure must support auto-scaling up to 10,000 concurrent active sessions.",
        "Availability: Minimum system availability of 99.9% uptime per calendar year."
      ]
    },
    databaseDesign: {
      type: "table",
      headers: ["Table/Entity Name", "Primary Key", "Core Attributes", "Relationships"],
      rows: [
        ["users", "id (UUID)", "email, password_hash, role, created_at", "1:N with proposals"],
        ["proposals", "id (Integer)", "title, client_name, industry, sections, status", "N:1 with users"],
        ["system_logs", "id (UUID)", "user_id, action, ip_address, timestamp", "N:1 with users"]
      ]
    },
    apiArchitecture: {
      type: "table",
      headers: ["Endpoint URL", "Method", "Auth Required", "Description"],
      rows: [
        ["/api/v1/auth/login", "POST", "No", "Authenticates credentials and returns JWT token."],
        ["/api/v1/proposals", "GET", "Yes", "Lists all active proposals with filter attributes."],
        ["/api/v1/proposals/:id", "PUT", "Yes", "Updates sections data for a target proposal."],
        ["/api/v1/pdf/export", "POST", "Yes", "Queues Puppeteer generator to compile PDF."]
      ]
    },
    security: {
      type: "rich-text",
      content: `### Security and Compliance Blueprint

The platform is designed with a "security-first" posture:
1. **Data Encryption**: All data is encrypted in transit using TLS 1.3 and at rest using AES-256 keys managed by Cloud KMS.
2. **Access Control**: Strict Role-Based Access Control (RBAC) governs user actions. No user can access or modify resource records without specific JWT verification.
3. **Audit Trails**: Every API call is logged to a write-once audit table, logging who performed the action, their IP address, and timestamps.`
    },
    aiIntegration: {
      type: "rich-text",
      content: `### AI-Driven Content & Strategy Automation

To expedite proposal writing and business planning, our system leverages cutting-edge LLMs (Gemini & OpenAI) through specialized API gateways:
- **Intelligent Prompt Pipelines**: Strategy blueprints are compiled in parallel batches, reducing network wait times.
- **Context Preservation**: Client details and industry dynamics are continuously fed to the context window to prevent generic outputs.
- **Format Integrity**: Strict JSON schemas are enforced on all LLM responses, avoiding parse errors and UI breaking artifacts.`
    },
    thirdPartyIntegrations: {
      type: "table",
      headers: ["Vendor / API Service", "Connection Method", "Integration Goal"],
      rows: [
        ["Google Cloud / AWS", "SDK / IAM Role", "Secure storage of company logos and generated proposal PDFs."],
        ["ImageKit API", "HTTPS SDK", "Optimizes, stores, and serves signature images and logos at high speed."],
        ["Puppeteer PDF Renderer", "Node Subprocess", "Generates print-ready high-DPI PDFs in A4 format on the server."]
      ]
    },
    developmentMethodology: {
      type: "rich-text",
      content: `### Agile Scrum Development Methodology

We utilize the **Agile Scrum** framework to ensure rapid, high-quality feature delivery:
- **2-Week Sprints**: Standard sprint cycles with daily standups, sprint planning, and retrospective sessions.
- **Continuous Integration (CI/CD)**: Code changes are run through linting, type testing, and automated builds before merging.
- **Client Sync Meetings**: Bi-weekly demo presentations to align features with the business objectives.`
    },
    sprintPlanning: {
      type: "table",
      headers: ["Sprint Cycle", "Target Timeline", "Primary Objectives & Deliverables"],
      rows: [
        ["Sprint 1", "Weeks 1 - 2", "Define project architecture, setup database schema, and build auth APIs."],
        ["Sprint 2", "Weeks 3 - 4", "Develop UI form builder and live preview panel layouts."],
        ["Sprint 3", "Weeks 5 - 6", "Build Puppeteer PDF generation and export integrations."],
        ["Sprint 4", "Weeks 7 - 8", "Final QA verification, penetration testing, and production deployment."]
      ]
    },
    timeline: {
      type: "timeline",
      items: [
        { phase: "Initiation & Setup", duration: "2 Weeks", deliverables: "System designs, repository configuration, database migrations." },
        { phase: "Core UI/UX Builder", duration: "2 Weeks", deliverables: "Proposal editor, responsive preview panel, visual cards." },
        { phase: "PDF Engine & Integrations", duration: "2 Weeks", deliverables: "Server-side Puppeteer pipeline, asset cloud storage." },
        { phase: "QA, Audit, & Launch", duration: "2 Weeks", deliverables: "Performance optimization, security scanner, deployment." }
      ]
    },
    milestones: {
      type: "table",
      headers: ["Milestone Name", "Target Week", "Verification / Sign-Off Criteria"],
      rows: [
        ["Milestone 1: Database & API Setup", "Week 2", "All database entities migrated and core REST endpoints active."],
        ["Milestone 2: UI Panel Active", "Week 4", "Preview panel rendering layout components with Mock JSON payload."],
        ["Milestone 3: PDF Generation", "Week 6", "Successful exports of formatted A4 documents containing charts."],
        ["Milestone 4: Deployment Live", "Week 8", "System fully deployed to cloud infrastructure with zero build errors."]
      ]
    },
    teamStructure: {
      type: "grid-cards",
      cards: [
        {
          title: "Project Manager",
          desc: "Manages timelines, leads standups, and bridges client requirements.",
          icon: "team",
          variant: "info"
        },
        {
          title: "Senior Full-Stack Developer",
          desc: "Architects the database, builds API backend, and constructs React UI.",
          icon: "mobile",
          variant: "highlight"
        },
        {
          title: "Cloud DevOps Specialist",
          desc: "Handles containerization, Docker scripts, CI/CD, and CDN optimization.",
          icon: "cloud",
          variant: "callout"
        }
      ]
    },
    testingStrategy: {
      type: "rich-text",
      content: `### Testing & Quality Assurance Plan

Our testing process includes multiple quality gates:
1. **Unit Testing**: Run with Jest/Vitest for all core utility and parsing functions.
2. **Integration Testing**: Testing API endpoint responses, token validation, and database operations.
3. **End-to-End Testing**: Using Playwright/Cypress to simulate browser flows, clicks, and PDF exports.
4. **Performance Scans**: Load testing endpoints to guarantee response times under heavy user loads.`
    },
    deployment: {
      type: "rich-text",
      content: `### Seamless Cloud Deployment Strategy

We target a secure containerized deployment pipeline:
- **Docker Integration**: All services are built into lightweight Docker images.
- **Kubernetes / ECS Orchestration**: Providing automated container replacement, traffic routing, and auto-scaling.
- **CDN Edge Caching**: Assets and static resources are served via Cloudflare edge nodes, reducing load times globally.`
    },
    hosting: {
      type: "rich-text",
      content: `### Hosting Recommendations

We recommend hosting the platform on **Google Cloud Platform (GCP)** or **Render** for rapid scaling:
- **Compute Instance**: Google Cloud Run (Serverless container runtime) or Render Web Service.
- **SQL Server**: Google Cloud SQL for PostgreSQL or Render Managed Database.
- **Storage**: Google Cloud Storage or ImageKit bucket for optimized content delivery.`
    },
    maintenance: {
      type: "rich-text",
      content: `### Post-Launch Maintenance Agreement

Following deployment, ${contactDetails || "TechVision Solutions"} provides comprehensive maintenance:
- **Server Health Checking**: Automated uptime monitors sending instant alert notifications.
- **Minor Bug Fixes**: Immediate patching of visual alignment, typos, and minor data issues.
- **Software Dependencies**: Periodic audits of Node modules to address security deprecations.`
    },
    support: {
      type: "rich-text",
      content: `### Support SLA (Service Level Agreement)

We provide Tier-1 support with dedicated turnaround times:
- **Critical issues (P0)**: System downtime or data loss - addressed in less than **2 hours**.
- **Important issues (P1)**: Specific module failure - addressed in less than **1 business day**.
- **General issues (P2)**: Cosmetic updates, non-breaking requests - addressed in **3 business days**.`
    },
    training: {
      type: "rich-text",
      content: `### Handover & Training Program

To ensure your team can operate the system efficiently, we provide:
1. **Developer Handover Docs**: Code diagrams, database schemas, and setup instructions.
2. **Video Tutorials**: Screen recordings demonstrating how to use the admin portal.
3. **Training Call**: A 2-hour interactive video session to answer any onboarding questions.`
    },
    costEstimation: {
      type: "table",
      headers: ["Project Phase / Resource", "Duration / Description", "Resource Cost"],
      rows: [
        ["Design & System Architecture", "Weeks 1 - 2", "$12,000"],
        ["Frontend UI/UX Implementation", "Weeks 3 - 5", "$24,000"],
        ["Backend APIs & Cloud Engine", "Weeks 6 - 7", "$22,000"],
        ["QA Testing, Security & Deploy", "Week 8", "$8,000"],
        ["**Total Est. Project Cost**", "**8 Weeks Total**", `**${budget}**`]
      ]
    },
    paymentMilestones: {
      type: "table",
      headers: ["Milestone Phase", "Percentage Due", "Trigger Event / Verification"],
      rows: [
        ["Initial Retainer", "25%", "Upon project kickoff and contract execution."],
        ["Design Approval", "25%", "UI design approval and database configuration launch."],
        ["Beta Release", "25%", "All core modules active and system staging deploy completed."],
        ["Production Handover", "25%", "Successful production launch and training handover."]
      ]
    },
    futureEnhancements: {
      type: "bullet-list",
      items: [
        `Native Android and iOS mobile applications published to app stores for the ${industry} industry.`,
        "Enhanced machine learning intelligence to suggest text revisions based on win-rates.",
        "Direct integration with popular corporate CRMs (Salesforce, HubSpot) to pre-fill client names."
      ]
    },
    riskAnalysis: {
      type: "table",
      headers: ["Risk Description", "Impact Level", "Mitigation Strategy"],
      rows: [
        ["Rate limits from Google Gemini AI APIs.", "Medium", "Implement fallback caching and structured local mockup generation."],
        ["Delay in branding logo asset delivery.", "Low", "Use placeholder text elements that scale automatically."],
        ["Security breach attempts.", "High", "Enforce Multi-Factor Auth, daily data backups, and encryption at rest."]
      ]
    },
    termsConditions: {
      type: "rich-text",
      content: `### Terms & Conditions

1. **Validity**: This proposal is valid for 30 days from the date of issue.
2. **Scope Changes**: Any requirements requested outside this specification will be evaluated as separate change requests.
3. **Client Delay**: ${contactDetails || "TechVision Solutions"} is not responsible for timeline delays resulting from slow feedback or asset delivery.`
    },
    acceptanceCriteria: {
      type: "bullet-list",
      items: [
        "System handles concurrent users successfully without database locking.",
        "Generated PDFs render correctly in A4 format without clipping text.",
        "Successful SAML login authentication with corporate credentials."
      ]
    },
    warranty: {
      type: "rich-text",
      content: `### Warranty & Liability Details

We provide a **90-day post-launch warranty**. During this period, all bug fixes, security patches, and database adjustments required to meet the original specifications are executed free of charge.

${contactDetails || "TechVision Solutions"}'s total liability under this project is limited to the fees paid for services.`
    },
    thankYou: {
      type: "rich-text",
      content: `### Thank You for Choosing ${contactDetails || "TechVision Solutions"}

We are excited about the opportunity to partner with **${clientName}**. Our team is fully committed to delivering a world-class, secure digital product that achieves all business objectives.

For any questions, please reach out to **hello@techvisionsolutions.com**.`
    },
    signaturePage: {
      type: "rich-text",
      content: `### Acceptance & Authorization

By signing below, the parties agree to the terms, timelines, and budgets outlined in this business proposal:

- **For ${clientName}**: __________________________  Date: ____________
- **For ${contactDetails || "TechVision Solutions"}**: _________________  Date: ____________`
    }
  };
}
