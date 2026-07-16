import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useUpdateProposal,
  useGenerateProposalContent,
  useRewriteContent,
  getGetProposalQueryKey,
  Proposal
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Wand2, Maximize2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { markdownToHtml } from "@/lib/markdown";

import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { ThemeProvider, useIndustryTheme } from "@/components/enterprise/ThemeProvider";
import { CoverPage } from "@/components/enterprise/CoverPage";
import { SectionPage } from "@/components/enterprise/SectionPage";
import { FeatureCard } from "@/components/enterprise/FeatureCard";
import { Timeline } from "@/components/enterprise/Timeline";
import { DiagramRenderer } from "@/components/enterprise/DiagramRenderer";
import { ChartRenderer } from "@/components/enterprise/ChartRenderer";

// ─── Custom Parser Helpers & Components ────────────────────────────────────────

function parseArchitecture(markdown: string) {
  if (!markdown) return null;
  const layers = [
    { key: "Client Channels", label: "Client Channels (User-Facing Applications)", color: "#3B82F6", icon: "📱" },
    { key: "API Gateway Layer", label: "API Gateway Layer", color: "#6366F1", icon: "🌐" },
    { key: "Identity Provider", label: "Identity & Authentication (Keycloak SSO)", color: "#EC4899", icon: "🔑" },
    { key: "Microservices Backend", label: "Microservices Backend (Core Spring Boot)", color: "#8B5CF6", icon: "⚙️" },
    { key: "Data & Infrastructure Layer", label: "Data & Infrastructure Layer", color: "#10B981", icon: "🗄️" }
  ];

  const parsed: { label: string; text: string; color: string; icon: string }[] = [];
  
  for (const layer of layers) {
    const regex = new RegExp(`(?:[-*•]|\\d+\\.)\\s+\\*\\*${layer.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*:\\s*(.*)`, "i");
    const match = markdown.match(regex);
    if (match && match[1]) {
      parsed.push({
        label: layer.label,
        text: match[1].trim(),
        color: layer.color,
        icon: layer.icon
      });
    }
  }

  if (parsed.length === 0) return null;
  return parsed;
}

function ArchitectureDiagram({ markdown }: { markdown: string }) {
  const layers = parseArchitecture(markdown);
  if (!layers) return null;

  return (
    <div className="mt-6 mb-8 bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="font-serif font-bold text-base text-white mb-6 text-center">
        🌐 System Architecture Blueprint
      </div>
      <div className="flex flex-col items-center gap-4">
        {layers.map((layer, idx) => (
          <div key={idx} className="w-full flex flex-col items-center">
            <div className="w-full max-w-[600px] bg-white/5 border border-dashed rounded-lg p-4 flex items-center gap-4" style={{ borderColor: `${layer.color}60`, borderLeft: `5px solid ${layer.color}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${layer.color}20` }}>
                {layer.icon}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  {layer.label}
                </div>
                <div className="text-sm text-white font-medium mt-1 leading-relaxed">
                  {layer.text}
                </div>
              </div>
            </div>
            {idx < layers.length - 1 && (
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-3" style={{ background: `linear-gradient(180deg, ${layer.color}, ${layers[idx+1].color})` }} />
                <div className="text-[10px] text-slate-600">▼</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function parseTechTable(markdown: string) {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const techRows: { layer: string; tech: string; desc: string }[] = [];
  for (const line of lines) {
    if (line.includes("|") && !line.includes("Layer | Technology")) {
      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
      if (cells.length >= 3 && !cells[1].startsWith("---") && !cells[1].startsWith("-")) {
        techRows.push({
          layer: cells[0].replace(/\*\*/g, ""),
          tech: cells[1].replace(/\*\*/g, ""),
          desc: cells[2]
        });
      }
    }
  }
  return techRows.length > 0 ? techRows : null;
}

const techIcons: Record<string, string> = {
  Backend: "☕", Frontend: "⚛️", Mobile: "📱", "Data & Messaging": "🗄️", "Platform & Security": "🔐", "Observability & Infra": "☁️"
};
const techColors: Record<string, string> = {
  Backend: "#EF4444", Frontend: "#3B82F6", Mobile: "#8B5CF6", "Data & Messaging": "#F59E0B", "Platform & Security": "#EC4899", "Observability & Infra": "#10B981"
};

function TechStackVisual({ markdown }: { markdown: string }) {
  const rows = parseTechTable(markdown);
  if (!rows) return null;

  return (
    <div className="mt-6 mb-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="font-serif font-bold text-base text-slate-800 dark:text-slate-200 mb-6 text-center">
        🛠️ Enterprise Technology Stack
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row, idx) => {
          const color = techColors[row.layer] || "#6366F1";
          const icon = techIcons[row.layer] || "🔧";
          return (
            <div key={idx} className="bg-white dark:bg-slate-950 rounded-lg p-4 border shadow-sm" style={{ borderColor: `${color}30`, borderTop: `3px solid ${color}` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-base">{icon}</span>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{row.layer}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{row.tech}</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{row.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseTimelineTable(markdown: string) {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const timelineRows: { phase: string; duration: string; deliverables: string }[] = [];
  for (const line of lines) {
    if (line.includes("|") && !line.includes("Phase | Duration")) {
      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
      if (cells.length >= 3 && !cells[1].startsWith("---") && !cells[1].startsWith("-")) {
        timelineRows.push({
          phase: cells[0].replace(/\*\*/g, ""),
          duration: cells[1].replace(/\*\*/g, ""),
          deliverables: cells[2]
        });
      }
    }
  }
  return timelineRows.length > 0 ? timelineRows : null;
}

function TimelineVisual({ markdown }: { markdown: string }) {
  const phases = parseTimelineTable(markdown);
  if (!phases) return null;

  return (
    <div className="mt-6 mb-8 bg-white dark:bg-slate-950 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="font-serif font-bold text-base text-slate-800 dark:text-slate-200 mb-6 text-center">
        📅 Projected Development Timeline
      </div>
      <div className="flex flex-col gap-4 relative pl-4">
        {/* vertical connector line */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 to-pink-500 opacity-20" />
        
        {phases.map((p, idx) => (
          <div key={idx} className="flex gap-4 relative">
            <div className="w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 shadow-md flex-shrink-0 z-10 mt-1" style={{ background: idx === 0 ? "#4F46E5" : idx === phases.length - 1 ? "#EC4899" : "#8B5CF6" }} />
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg p-4 flex-1 flex justify-between gap-4 items-start">
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{p.phase}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{p.deliverables}</div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-3 py-1 text-[10px] font-bold white-space-nowrap flex-shrink-0">
                {p.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Renderer for Structured JSON ─────────────────────────────────────

function ProposalSectionRenderer({ sectionData }: { sectionData: any }) {
  if (!sectionData) return null;

  // Handle old string format (markdown)
  if (typeof sectionData === "string") {
    try {
      const parsed = JSON.parse(sectionData);
      if (parsed && typeof parsed === "object") {
        return <ProposalSectionRendererContent data={parsed} />;
      }
    } catch (_) {
      // Ignore and render as markdown
    }
    return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sectionData) }} />;
  }

  // Handle new object format
  return <ProposalSectionRendererContent data={sectionData} />;
}

function ProposalSectionRendererContent({ data }: { data: any }) {
  const type = data.type || "rich-text";

  switch (type) {
    case "cover":
      return (
        <CoverPage
          clientName={data.client || ""}
          projectName={data.title || ""}
          projectDate={data.date}
        />
      );

    case "rich-text":
      return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(data.content || data.html || "") }} />;

    case "grid-cards":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {data.cards?.map((card: any, idx: number) => (
            <FeatureCard
              key={idx}
              title={card.title}
              description={card.desc}
              iconName={card.icon}
              variant={card.variant || "info"}
              statValue={card.statValue}
            />
          ))}
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto mt-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="width-full border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                {data.headers?.map((h: string, idx: number) => (
                  <th key={idx} className="p-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows?.map((row: any[], rIdx: number) => (
                <tr key={rIdx} className={`${rIdx % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/50 dark:bg-slate-900/20"} border-b border-slate-100 dark:border-slate-800`}>
                  {row.map((cell: any, cIdx: number) => (
                    <td key={cIdx} className="p-3 text-slate-600 dark:text-slate-400">
                      {typeof cell === "object" ? JSON.stringify(cell) : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "bullet-list":
      return (
        <ul className="list-disc pl-5 mt-4 space-y-2 text-xs">
          {data.items?.map((item: string, idx: number) => (
            <li key={idx} className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</li>
          ))}
        </ul>
      );

    case "timeline":
      return <Timeline items={data.items || []} />;

    case "diagram-spec":
      return <DiagramRenderer format={data.format} data={data.data} />;

    case "chart-spec":
      return <ChartRenderer type={data.chartType} data={data.data} title={data.title} />;

    default:
      return null;
  }
}

const THEME_ACCENTS: Record<string, { primary: string; secondary: string; coverBg: string; dots: string }> = {
  Healthcare: { primary: "#06B6D4", secondary: "#3B82F6", coverBg: "linear-gradient(135deg, #083344 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #06B6D4, #3B82F6, #60A5FA, #0891B2)" },
  Fintech: { primary: "#10B981", secondary: "#4F46E5", coverBg: "linear-gradient(135deg, #064E3B 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #10B981, #4F46E5, #34D399, #6366F1)" },
  "Real Estate": { primary: "#F59E0B", secondary: "#78350F", coverBg: "linear-gradient(135deg, #451A03 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #F59E0B, #78350F, #FBBF24, #D97706)" },
  Legal: { primary: "#1E3A8A", secondary: "#B45309", coverBg: "linear-gradient(135deg, #030712 0%, #172554 100%)", dots: "linear-gradient(90deg, #1E3A8A, #B45309, #3B82F6, #D97706)" },
  Education: { primary: "#8B5CF6", secondary: "#EC4899", coverBg: "linear-gradient(135deg, #2E1065 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #8B5CF6, #EC4899, #A78BFA, #F472B6)" },
  Technology: { primary: "#4F46E5", secondary: "#7C3AED", coverBg: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", dots: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #F59E0B)" },
  Manufacturing: { primary: "#4B5563", secondary: "#EA580C", coverBg: "linear-gradient(135deg, #111827 0%, #1F2937 100%)", dots: "linear-gradient(90deg, #4B5563, #EA580C, #9CA3AF, #F97316)" },
  Agriculture: { primary: "#16A34A", secondary: "#854D0E", coverBg: "linear-gradient(135deg, #062F14 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #16A34A, #854D0E, #4ADE80, #A16207)" },
  IoT: { primary: "#0891B2", secondary: "#10B981", coverBg: "linear-gradient(135deg, #164E63 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #0891B2, #10B981, #22D3EE, #34D399)" },
  Restaurant: { primary: "#E11D48", secondary: "#D97706", coverBg: "linear-gradient(135deg, #4C0519 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #E11D48, #D97706, #F43F5E, #FBBF24)" },
  Construction: { primary: "#EAB308", secondary: "#374151", coverBg: "linear-gradient(135deg, #422006 0%, #0F172A 100%)", dots: "linear-gradient(90deg, #EAB308, #374151, #FDE047, #4B5563)" },
  indigo: { primary: "#4F46E5", secondary: "#7C3AED", coverBg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", dots: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #F59E0B)" },
  emerald: { primary: "#10B981", secondary: "#059669", coverBg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)", dots: "linear-gradient(90deg, #10B981, #059669, #34D399, #3B82F6)" },
  sunset: { primary: "#F59E0B", secondary: "#D97706", coverBg: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #451a03 100%)", dots: "linear-gradient(90deg, #F59E0B, #D97706, #FBBF24, #10B981)" },
  rose: { primary: "#E11D48", secondary: "#BE123C", coverBg: "linear-gradient(135deg, #4c0519 0%, #881337 50%, #4c0519 100%)", dots: "linear-gradient(90deg, #E11D48, #BE123C, #F43F5E, #EC4899)" },
  navy: { primary: "#1E3A8A", secondary: "#2563EB", coverBg: "linear-gradient(135deg, #030712 0%, #172554 50%, #030712 100%)", dots: "linear-gradient(90deg, #1E3A8A, #2563EB, #60A5FA, #7C3AED)" },
  obsidian: { primary: "#111827", secondary: "#374151", coverBg: "linear-gradient(135deg, #030712 0%, #1f2937 50%, #030712 100%)", dots: "linear-gradient(90deg, #111827, #374151, #4B5563, #9CA3AF)" }
};

interface ProposalPreviewPanelProps {
  proposal?: Proposal;
  selectedTheme: string;
}

const SECTION_KEYS = [
  "coverPage", "confidentialPage", "executiveSummary", "businessUnderstanding", "currentChallenges",
  "painPoints", "businessObjectives", "proposedSolution", "whyThisSolution", "systemOverview",
  "architectureDiagram", "userFlow", "technologyStack", "projectModules", "features",
  "functionalRequirements", "nonFunctionalRequirements", "databaseDesign", "apiArchitecture", "security",
  "aiIntegration", "thirdPartyIntegrations", "developmentMethodology", "sprintPlanning", "timeline",
  "milestones", "teamStructure", "testingStrategy", "deployment", "hosting",
  "maintenance", "support", "training", "costEstimation", "paymentMilestones",
  "futureEnhancements", "riskAnalysis", "termsConditions", "acceptanceCriteria", "warranty",
  "thankYou", "signaturePage"
];

const SECTION_TITLES: Record<string, string> = {
  coverPage: "Cover Page",
  confidentialPage: "Confidentiality Agreement",
  executiveSummary: "Executive Summary",
  businessUnderstanding: "Business Understanding",
  currentChallenges: "Current Challenges",
  painPoints: "Pain Points",
  businessObjectives: "Business Objectives",
  proposedSolution: "Proposed Solution",
  whyThisSolution: "Why This Solution",
  systemOverview: "System Overview",
  architectureDiagram: "System Architecture Diagram",
  userFlow: "User Journey & Flow",
  technologyStack: "Technology Stack",
  projectModules: "Project Modules",
  features: "Key Features",
  functionalRequirements: "Functional Requirements",
  nonFunctionalRequirements: "Non-Functional Requirements",
  databaseDesign: "Database Design Schema",
  apiArchitecture: "API Architecture",
  security: "Security Controls",
  aiIntegration: "AI Integration Capabilities",
  thirdPartyIntegrations: "Third-Party Integrations",
  developmentMethodology: "Development Methodology",
  sprintPlanning: "Sprint Planning",
  timeline: "Project Timeline",
  milestones: "Project Milestones",
  teamStructure: "Project Team Structure",
  testingStrategy: "Testing Strategy",
  deployment: "Deployment Plan",
  hosting: "Hosting Strategy",
  maintenance: "Maintenance Plan",
  support: "Support SLA",
  training: "Training & Handover",
  costEstimation: "Cost Estimation",
  paymentMilestones: "Payment Milestones",
  futureEnhancements: "Future Enhancements Roadmap",
  riskAnalysis: "Risk Analysis & Mitigation",
  termsConditions: "Terms & Conditions",
  acceptanceCriteria: "Acceptance Criteria",
  warranty: "Warranty & SLA Details",
  thankYou: "Thank You Note",
  signaturePage: "Signatures & Execution"
};

const SECTION_EMOJIS: Record<string, string> = {
  coverPage: "📖", confidentialPage: "🔒", executiveSummary: "📋", businessUnderstanding: "🏢", currentChallenges: "⚠️",
  painPoints: "🔥", businessObjectives: "🎯", proposedSolution: "💡", whyThisSolution: "❓", systemOverview: "🌐",
  architectureDiagram: "📐", userFlow: "🔄", technologyStack: "🔧", projectModules: "📦", features: "⚡",
  functionalRequirements: "📝", nonFunctionalRequirements: "🛡️", databaseDesign: "🗄️", apiArchitecture: "🔌", security: "🔑",
  aiIntegration: "🤖", thirdPartyIntegrations: "🧩", developmentMethodology: "🤝", sprintPlanning: "📅", timeline: "🗓️",
  milestones: "🏆", teamStructure: "👥", testingStrategy: "🧪", deployment: "🚀", hosting: "☁️",
  maintenance: "🛠️", support: "☎️", training: "🎓", costEstimation: "💰", paymentMilestones: "💳",
  futureEnhancements: "🚀", riskAnalysis: "⚡", termsConditions: "⚖️", acceptanceCriteria: "✔️", warranty: "🛡️",
  thankYou: "🙏", signaturePage: "✍️"
};

export function ProposalPreviewPanel({ proposal, selectedTheme }: ProposalPreviewPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  const themeColors = THEME_ACCENTS[selectedTheme] || THEME_ACCENTS.indigo;

  const updateProposal = useUpdateProposal({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetProposalQueryKey(data.id), data);
      },
      onError: () => {
        toast({ title: "Failed to update section visibility", variant: "destructive" });
      }
    }
  });

  const generateContent = useGenerateProposalContent({
    mutation: {
      onSuccess: (data, variables) => {
        if (proposal) {
          const sections = { ...(proposal.sections as Record<string, string>) || {} };
          sections[variables.data.section] = data.content;
          
          updateProposal.mutate({
            id: proposal.id,
            data: { sections: sections as any }
          });
        }
        setGeneratingSection(null);
        toast({ title: "Section generated successfully" });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Failed to generate section", variant: "destructive" });
      }
    }
  });

  const rewriteContent = useRewriteContent({
    mutation: {
      onSuccess: (data, variables) => {
        if (proposal) {
          const sections = { ...(proposal.sections as Record<string, string>) || {} };
          sections[variables.data.section] = data.content;
          
          updateProposal.mutate({
            id: proposal.id,
            data: { sections: sections as any }
          });
        }
        setGeneratingSection(null);
        toast({ title: "Section rewritten successfully" });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Failed to rewrite section", variant: "destructive" });
      }
    }
  });

  if (!proposal) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-card/30">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Wand2 className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground mb-2">Live Preview</h3>
        <p className="max-w-sm">Fill out the proposal details and click "Generate with AI" to see the full document here.</p>
      </div>
    );
  }

  const sections = (proposal.sections || {}) as Record<string, string>;
  const enabledSections = (proposal.enabledSections || {}) as Record<string, boolean>;

  const toggleSection = (key: string, enabled: boolean) => {
    const updatedEnabled = { ...enabledSections, [key]: enabled };
    updateProposal.mutate({
      id: proposal.id,
      data: { enabledSections: updatedEnabled as any }
    });
  };

  const handleGenerateSection = (key: string) => {
    setGeneratingSection(key);
    generateContent.mutate({
      data: {
        section: key,
        clientName: proposal.clientName,
        projectName: proposal.projectName,
        clientIndustry: proposal.clientIndustry,
        projectType: proposal.projectType,
        budgetRange: proposal.budgetRange,
        additionalContext: proposal.additionalContext,
        contactDetails: proposal.contactDetails
      }
    });
  };

  const handleRewrite = (key: string, tone: string) => {
    const content = sections[key];
    if (!content) return;

    setGeneratingSection(key);
    rewriteContent.mutate({
      data: {
        section: key,
        content,
        tone
      }
    });
  };

  const activeSections = SECTION_KEYS.filter(k => enabledSections[k] !== false && sections[k]);
  const isAnySectionGenerated = Object.values(sections).some(s => !!s);

  if (!isAnySectionGenerated) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card/30">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Wand2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Ready to Generate</h3>
        <p className="max-w-md text-muted-foreground mb-8">
          The details are set. Click the "Generate with AI" button on the left to instantly build a complete, investor-grade proposal.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900/50">
      {/* ── TOP BAR ── */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-serif font-semibold">Live Proposal Preview</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest font-bold">
            {selectedTheme.toUpperCase()} THEME
          </span>
        </div>
        <Link href={`/proposals/${proposal.id}/preview`}>
          <Button variant="default" size="sm" className="shadow-sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Full Screen PDF
          </Button>
        </Link>
      </div>

      {/* ── DOCUMENT FLOW ── */}
      <ScrollArea className="flex-1 p-4 lg:p-8">
        <ThemeProvider industry={proposal.clientIndustry}>
          <div className="max-w-[760px] mx-auto space-y-6 pb-20">
          
          {/* ══════════════════════════════════════════════════════════════
              COVER PAGE
          ══════════════════════════════════════════════════════════════ */}
          <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
            <CoverPage
              clientName={proposal.clientName}
              projectName={proposal.projectName}
              projectDate={proposal.projectDate}
              logoUrl={proposal.logoUrl}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TABLE OF CONTENTS
          ══════════════════════════════════════════════════════════════ */}
          <div className="bg-card rounded-2xl border border-border shadow-md p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full" style={{ background: `linear-gradient(180deg, ${themeColors.primary}, ${themeColors.secondary})` }} />
              <h3 className="font-serif font-extrabold text-xl text-slate-800 dark:text-slate-200">Table of Contents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSections.map((key, idx) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl" style={{ borderLeft: `3px solid ${themeColors.primary}` }}>
                  <span className="text-base">{SECTION_EMOJIS[key]}</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{SECTION_TITLES[key]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              CONTENT SECTIONS
          ══════════════════════════════════════════════════════════════ */}
          {SECTION_KEYS.map((key, idx) => {
            const isEnabled = enabledSections[key] !== false;
            const content = sections[key];
            const isGenerating = generatingSection === key;

            return (
              <div 
                key={key} 
                className={`bg-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isEnabled ? "border-border shadow-md" : "border-border/40 opacity-40 grayscale-[0.5]"
                }`}
              >
                {/* Section top accent */}
                <div style={{ height: "4px", background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.primary}50)` }} />

                {/* Hover control toolbar */}
                <div className="px-6 py-3 border-b border-border/50 flex items-center justify-between bg-muted/10">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={isEnabled} 
                      onCheckedChange={(checked) => toggleSection(key, checked)}
                    />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Section {String(idx + 1).padStart(2, "0")}</span>
                    <h3 className="font-serif font-bold text-slate-800 dark:text-slate-100">{SECTION_TITLES[key]}</h3>
                  </div>

                  {isEnabled && (
                    <div className="flex items-center gap-2">
                      {content ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isGenerating} className="h-7 text-[10px] font-medium">
                              {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                              AI Rewrite
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleRewrite(key, "professional")}>Professional</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRewrite(key, "premium")}>Premium</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRewrite(key, "startup")}>Startup</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleGenerateSection(key)}
                          disabled={isGenerating}
                          className="h-7 text-[10px] font-medium"
                        >
                          {isGenerating ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generating...</> : <><Wand2 className="w-3 h-3 mr-1" /> Generate</>}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Section Content Page */}
                {isEnabled && (
                  <div className="p-8">
                    {isGenerating ? (
                      <div className="space-y-4 py-4">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                      </div>
                    ) : content ? (
                      <div className="space-y-6">
                        <ProposalSectionRenderer sectionData={content} />
                        {typeof content === "string" && key === "projectOverview" && (
                          <>
                            <ArchitectureDiagram markdown={content} />
                            <TimelineVisual markdown={content} />
                          </>
                        )}
                        {typeof content === "string" && key === "technologyStack" && (
                          <TechStackVisual markdown={content} />
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground italic font-serif text-sm">
                        Section content empty. Click Generate to build this section.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ══════════════════════════════════════════════════════════════
              SIGNATURE PAGE
          ══════════════════════════════════════════════════════════════ */}
          <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
            <div style={{ background: themeColors.coverBg }} className="p-12 text-center text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full filter blur-[60px] opacity-15" style={{ background: themeColors.primary }} />
              <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: themeColors.primary }} />
              <h2 className="font-serif text-2xl font-bold mb-4">Let's Build Something Extraordinary Together.</h2>
              
              <div className="grid grid-cols-2 gap-4 mt-8 text-left text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-[9px] text-white/40 uppercase tracking-widest mb-4">Client Acceptance</div>
                  <div className="h-10 border-b border-white/20 mb-2 flex items-end">
                    {proposal.signatureUrl && <img src={proposal.signatureUrl} alt="Signature" className="h-8 object-contain" />}
                  </div>
                  <div className="text-white/80 font-bold">{proposal.clientName}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-[9px] text-white/40 uppercase tracking-widest mb-4">Authorized By</div>
                  <div className="h-10 border-b border-white/20 mb-2" />
                  <div className="text-white/80 font-bold">TechVision Solutions</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ThemeProvider>
    </ScrollArea>
  </div>
  );
}

