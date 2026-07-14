import { useParams, Link } from "wouter";
import { useGetProposal, getGetProposalQueryKey } from "@workspace/api-client-react";
import { useEffect, useRef, useState } from "react";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { markdownToHtml } from "@/lib/markdown";

declare global {
  interface Window {
    Chart: any;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

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
    <div style={{ marginTop: "24px", marginBottom: "32px", background: "#0f172a", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: "24px", textAlign: "center" }}>
        🌐 System Architecture Blueprint
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        {layers.map((layer, idx) => (
          <div key={idx} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "680px", background: "rgba(255,255,255,0.03)", border: `1px solid ${layer.color}60`, borderLeft: `6px solid ${layer.color}`, borderRadius: "12px", padding: "18px 24px", display: "flex", alignItems: "center", gap: "18px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${layer.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                {layer.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
                  {layer.label}
                </div>
                <div style={{ fontSize: "0.9rem", color: "white", fontWeight: 500, marginTop: "2px", lineHeight: 1.4 }}>
                  {layer.text}
                </div>
              </div>
            </div>
            {idx < layers.length - 1 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "4px 0" }}>
                <div style={{ width: "2px", height: "14px", background: "linear-gradient(180deg, " + layer.color + ", " + layers[idx+1].color + ")" }} />
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>▼</div>
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
    <div style={{ marginTop: "24px", marginBottom: "32px", background: "#f8fafc", borderRadius: "16px", padding: "32px", border: "1px solid #e2e8f0" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#1e293b", marginBottom: "24px", textAlign: "center" }}>
        🛠️ Enterprise Technology Stack
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {rows.map((row, idx) => {
          const color = techColors[row.layer] || "#6366F1";
          const icon = techIcons[row.layer] || "🔧";
          return (
            <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "20px", border: `1px solid ${color}30`, borderTop: `4px solid ${color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{row.layer}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>{row.tech}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5 }}>{row.desc}</div>
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
    <div style={{ marginTop: "28px", marginBottom: "32px", background: "white", borderRadius: "16px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#1e293b", marginBottom: "28px", textAlign: "center" }}>
        📅 Projected Development Timeline
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "16px" }}>
        {/* vertical connector line */}
        <div style={{ position: "absolute", left: "24px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, #4F46E5 0%, #EC4899 100%)", opacity: 0.3 }} />
        
        {phases.map((p, idx) => (
          <div key={idx} style={{ display: "flex", gap: "24px", position: "relative" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: idx === 0 ? "#4F46E5" : idx === phases.length - 1 ? "#EC4899" : "#8B5CF6", border: "4px solid white", boxShadow: "0 0 0 3px rgba(139,92,246,0.25)", flexShrink: 0, zIndex: 2, marginTop: "4px" }} />
            <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "16px 20px", flex: 1, display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{p.phase}</div>
                <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "4px", lineHeight: 1.4 }}>{p.deliverables}</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "white", borderRadius: "20px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                {p.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Chart Components (rendered after Chart.js loads) ─────────────────────────

function BarChartSection({ labels, values, title, color }: { labels: string[]; values: number[]; title: string; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    const ctx = ref.current.getContext("2d");
    const chart = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: color + "CC",
          borderColor: color,
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
          x: { grid: { display: false } }
        }
      }
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} style={{ maxHeight: "240px" }} />;
}

function DoughnutChart({ labels, values, colors, title }: { labels: string[]; values: number[]; colors: string[]; title: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    const ctx = ref.current.getContext("2d");
    const chart = new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderWidth: 3, borderColor: "white" }]
      },
      options: {
        responsive: true,
        cutout: "70%",
        plugins: {
          legend: { position: "bottom", labels: { padding: 16, font: { size: 11 } } }
        }
      }
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} style={{ maxHeight: "220px" }} />;
}

function LineChart({ labels, datasets, title }: { labels: string[]; datasets: { label: string; data: number[]; color: string }[]; title: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    const ctx = ref.current.getContext("2d");
    const chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: datasets.map(d => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color + "18",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: d.color,
        }))
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
          x: { grid: { display: false } }
        }
      }
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} style={{ maxHeight: "240px" }} />;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const THEME_ACCENTS: Record<string, { primary: string; secondary: string; coverBg: string; dots: string }> = {
  indigo: { primary: "#4F46E5", secondary: "#7C3AED", coverBg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", dots: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #F59E0B)" },
  emerald: { primary: "#10B981", secondary: "#059669", coverBg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)", dots: "linear-gradient(90deg, #10B981, #059669, #34D399, #3B82F6)" },
  sunset: { primary: "#F59E0B", secondary: "#D97706", coverBg: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #451a03 100%)", dots: "linear-gradient(90deg, #F59E0B, #D97706, #FBBF24, #10B981)" },
  rose: { primary: "#E11D48", secondary: "#BE123C", coverBg: "linear-gradient(135deg, #4c0519 0%, #881337 50%, #4c0519 100%)", dots: "linear-gradient(90deg, #E11D48, #BE123C, #F43F5E, #EC4899)" },
  navy: { primary: "#1E3A8A", secondary: "#2563EB", coverBg: "linear-gradient(135deg, #030712 0%, #172554 50%, #030712 100%)", dots: "linear-gradient(90deg, #1E3A8A, #2563EB, #60A5FA, #7C3AED)" },
  obsidian: { primary: "#111827", secondary: "#374151", coverBg: "linear-gradient(135deg, #030712 0%, #1f2937 50%, #030712 100%)", dots: "linear-gradient(90deg, #111827, #374151, #4B5563, #9CA3AF)" }
};

export default function ProposalPreview() {
  const params = useParams();
  const id = parseInt(params.id!);

  const [selectedTheme, setSelectedTheme] = useState<string>("indigo");

  useEffect(() => {
    const saved = localStorage.getItem(`proposal_theme_${id}`);
    if (saved) {
      setSelectedTheme(saved);
    }
  }, [id]);

  const themeColors = THEME_ACCENTS[selectedTheme] || THEME_ACCENTS.indigo;

  const { data: proposal, isLoading } = useGetProposal(id, {
    query: { enabled: !!id, queryKey: getGetProposalQueryKey(id) }
  });

  useEffect(() => {
    loadScript("https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js");
  }, []);

  if (isLoading || !proposal) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-500 font-medium">Preparing your proposal...</p>
        </div>
      </div>
    );
  }

  const sections = (proposal.sections || {}) as Record<string, string>;
  const enabledSections = (proposal.enabledSections || {}) as Record<string, boolean>;

  const sectionOrder = [
    "executiveSummary", "aboutCompany", "projectOverview", "features",
    "technologyStack", "pricing", "digitalMarketing", "addOns",
    "legalTerms", "acceptanceSection"
  ];

  const sectionTitles: Record<string, string> = {
    executiveSummary: "Executive Summary",
    aboutCompany: "About TechVision Solutions",
    projectOverview: "Project Overview",
    features: "Key Features & Modules",
    technologyStack: "Technology Stack",
    pricing: "Investment & Pricing",
    digitalMarketing: "Digital Marketing Strategy",
    addOns: "Optional Add-On Services",
    legalTerms: "Terms & Conditions",
    acceptanceSection: "Acceptance & Agreement"
  };

  const sectionEmojis: Record<string, string> = {
    executiveSummary: "📋", aboutCompany: "🏢", projectOverview: "🎯",
    features: "⚡", technologyStack: "🔧", pricing: "💰",
    digitalMarketing: "📈", addOns: "🚀", legalTerms: "⚖️", acceptanceSection: "✍️"
  };

  const accentColors: Record<string, string> = {
    executiveSummary: themeColors.primary, 
    aboutCompany: themeColors.secondary, 
    projectOverview: themeColors.primary,
    features: themeColors.primary, 
    technologyStack: themeColors.secondary, 
    pricing: themeColors.primary,
    digitalMarketing: themeColors.secondary, 
    addOns: themeColors.primary, 
    legalTerms: "#6B7280", 
    acceptanceSection: themeColors.secondary
  };

  const activeSections = sectionOrder.filter(k => enabledSections[k] !== false && sections[k]);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        .proposal-body * { box-sizing: border-box; }
        .proposal-body h1, .proposal-body h2, .proposal-body h3 { font-family: 'Playfair Display', Georgia, serif; }
        .proposal-body p { line-height: 1.85; color: #374151; font-size: 0.95rem; margin-bottom: 0.9rem; }
        .proposal-body ul { padding-left: 1.4rem; margin-bottom: 1rem; }
        .proposal-body ol { padding-left: 1.4rem; margin-bottom: 1rem; }
        .proposal-body li { line-height: 1.7; margin-bottom: 0.35rem; color: #374151; font-size: 0.93rem; }
        .proposal-body li::marker { color: #4F46E5; font-weight: bold; }
        .proposal-body h1 { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin: 1.5rem 0 0.75rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem; }
        .proposal-body h2 { font-size: 1.25rem; font-weight: 700; color: #2563eb; margin: 1.5rem 0 0.6rem; }
        .proposal-body h3 { font-size: 1.05rem; font-weight: 700; color: #374151; margin: 1.2rem 0 0.5rem; }
        .proposal-body h4 { font-size: 0.95rem; font-weight: 700; color: #4F46E5; margin: 1rem 0 0.4rem; }
        .proposal-body strong { font-weight: 700; color: #1e293b; }
        .proposal-body table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); font-size: 0.88rem; }
        .proposal-body thead tr { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; }
        .proposal-body th { padding: 13px 18px; text-align: left; font-weight: 600; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .proposal-body td { padding: 12px 18px; border-bottom: 1px solid #f1f5f9; }
        .proposal-body tbody tr:nth-child(even) { background: #f8fafc; }
        .proposal-body tbody tr:hover { background: #eff6ff; transition: background 0.15s; }
        .proposal-body hr { border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0; }
        .proposal-body blockquote { border-left: 4px solid #4F46E5; background: #eff6ff; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 10px 10px 0; font-style: italic; color: #374151; }
        .proposal-body code { background: #f1f5f9; padding: 0.2em 0.45em; border-radius: 4px; font-size: 0.85em; color: #7C3AED; font-family: 'Courier New', monospace; }
        .section-page { background: white; margin-bottom: 0; position: relative; overflow: hidden; }
        @media print {
          .no-print { display: none !important; }
          .section-page { page-break-after: always; box-shadow: none; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 100, background: "white", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href={`/proposals/${id}`}>
              <Button variant="ghost" size="sm" style={{ color: "#64748b" }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{proposal.clientName}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "1px" }}>{proposal.projectName}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{activeSections.length} sections • {format(new Date(proposal.projectDate || new Date()), "MMM d, yyyy")}</span>
            <button
              onClick={() => window.print()}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: themeColors.primary, color: "white", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", boxShadow: `0 4px 14px ${themeColors.primary}40` }}
            >
              <Printer style={{ width: "15px", height: "15px" }} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── DOCUMENT ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "32px 16px 80px", maxWidth: "980px", margin: "0 auto" }}>

        {/* ══════════════════════════════════════════════════════════════
            PAGE 1 — COVER
        ══════════════════════════════════════════════════════════════ */}
        <div className="section-page" style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "12px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          {/* Top color band */}
          <div style={{ height: "8px", background: themeColors.dots }} />

          {/* Cover body */}
          <div style={{ background: themeColors.coverBg, minHeight: "680px", padding: "60px 72px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Blur blobs */}
            {[
              { top: "-80px", right: "-80px", size: "400px", color: themeColors.primary + "40" },
              { bottom: "-100px", left: "-60px", size: "350px", color: themeColors.secondary + "30" },
              { top: "40%", left: "55%", size: "250px", color: themeColors.secondary + "20" }
            ].map((b: any, i) => (
              <div key={i} style={{ position: "absolute", borderRadius: "50%", background: b.color, filter: "blur(80px)", width: b.size, height: b.size, top: b.top, bottom: b.bottom, left: b.left, right: b.right, pointerEvents: "none" }} />
            ))}

            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              {proposal.logoUrl
                ? <img src={proposal.logoUrl} alt="Logo" style={{ height: "48px", objectFit: "contain" }} />
                : <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.3rem", color: "white", letterSpacing: "3px" }}>TECHVISION</div>}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", letterSpacing: "2px", textTransform: "uppercase" }}>Prepared</div>
                <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, marginTop: "2px" }}>
                  {format(new Date(proposal.projectDate || new Date()), "MMMM d, yyyy")}
                </div>
              </div>
            </div>

            {/* Center content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2, paddingTop: "48px" }}>
              {/* Accent line */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
                <div style={{ width: "48px", height: "4px", background: themeColors.primary, borderRadius: "2px" }} />
                <div style={{ width: "24px", height: "4px", background: themeColors.secondary, borderRadius: "2px" }} />
                <div style={{ width: "12px", height: "4px", background: themeColors.secondary + "80", borderRadius: "2px" }} />
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
                CONFIDENTIAL BUSINESS PROPOSAL
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.8rem", fontWeight: 900, color: "white", lineHeight: 1.08, marginBottom: "16px", letterSpacing: "-0.02em" }}>
                {proposal.clientName}
              </div>
              <div style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.65)", fontWeight: 300, marginBottom: "48px" }}>
                {proposal.projectName}
              </div>

              {/* Stats strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                {[
                  { icon: "📋", num: activeSections.length.toString(), label: "Sections" },
                  { icon: "💡", num: proposal.projectType?.split(" ")[0] || "Custom", label: "Project Type" },
                  { icon: "🏭", num: proposal.clientIndustry?.split(" ")[0] || "Industry", label: "Sector" },
                  { icon: "🏆", num: "ISO 27001", label: "Certified" }
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", backdropFilter: "blur(8px)" }}>
                    <div style={{ fontSize: "1.3rem", marginBottom: "8px" }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", marginBottom: "2px" }}>{s.num}</div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "28px", marginTop: "48px" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Prepared For</div>
                <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>{proposal.clientName}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{proposal.clientIndustry} Industry</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Prepared By</div>
                <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>TechVision Solutions</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>hello@techvisionsolutions.com</div>
              </div>
            </div>
          </div>

          {/* Bottom color band */}
          <div style={{ height: "5px", background: themeColors.dots }} />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PAGE 2 — TABLE OF CONTENTS + COMPANY HIGHLIGHTS
        ══════════════════════════════════════════════════════════════ */}
        <div className="section-page" style={{ borderRadius: "16px", marginBottom: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "64px 72px" }}>
          {/* TOC Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <div style={{ width: "6px", height: "48px", background: `linear-gradient(180deg, ${themeColors.primary}, ${themeColors.secondary})`, borderRadius: "3px" }} />
            <div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>Navigation</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: "#1e293b" }}>Table of Contents</div>
            </div>
          </div>

          {/* TOC Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "56px" }}>
            {activeSections.map((key, idx) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", background: "#f8fafc", borderRadius: "12px", borderLeft: `4px solid ${accentColors[key]}` }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: accentColors[key] + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                  {sectionEmojis[key]}
                </div>
                <div>
                  <div style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "1px" }}>{String(idx + 1).padStart(2, "0")}</div>
                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.88rem" }}>{sectionTitles[key]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Company Highlights Banner */}
          <div style={{ background: themeColors.coverBg, borderRadius: "16px", padding: "36px", color: "white" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 800, marginBottom: "28px" }}>
              Why TechVision Solutions?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {[
                { icon: "🏆", val: "8+ Years", sub: "Industry Experience" },
                { icon: "✅", val: "200+", sub: "Projects Delivered" },
                { icon: "⭐", val: "98%", sub: "Client Satisfaction" },
                { icon: "🌍", val: "30+", sub: "Countries Served" },
                { icon: "👥", val: "50+", sub: "Expert Team Members" },
                { icon: "🔒", val: "ISO 27001", sub: "Security Certified" }
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{s.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: "2px" }}>{s.val}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.7, letterSpacing: "0.5px" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            CONTENT SECTIONS
        ══════════════════════════════════════════════════════════════ */}
        {activeSections.map((key, idx) => {
          const color = accentColors[key];

          return (
            <div key={key} className="section-page" style={{ borderRadius: "16px", marginBottom: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
              {/* Section top accent */}
              <div style={{ height: "4px", background: `linear-gradient(90deg, ${color}, ${color}80)` }} />

              {/* Section header */}
              <div style={{ background: `linear-gradient(135deg, ${color}08, ${color}15)`, padding: "40px 64px 28px", borderBottom: `1px solid ${color}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: `0 8px 24px ${color}50`, flexShrink: 0 }}>
                    {sectionEmojis[key]}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: "#94a3b8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>
                      Section {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.8rem", color: "#1e293b", lineHeight: 1.1 }}>
                      {sectionTitles[key]}
                    </div>
                  </div>
                </div>
                {/* Decorative dots */}
                <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
                  <div style={{ width: "40px", height: "3px", background: color, borderRadius: "2px" }} />
                  <div style={{ width: "20px", height: "3px", background: color + "60", borderRadius: "2px" }} />
                  <div style={{ width: "10px", height: "3px", background: color + "30", borderRadius: "2px" }} />
                </div>
              </div>

              {/* Section body */}
              <div style={{ padding: "40px 64px 52px" }} className="proposal-body">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections[key]) }} />
              </div>

              {/* Inline charts/visuals for specific sections */}
              {key === "pricing" && (
                <div style={{ padding: "0 64px 48px" }}>
                  <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "32px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#1e293b", marginBottom: "24px" }}>📊 Package Comparison Overview</div>
                    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                      <BarChartSection
                        title="Relative Package Value"
                        labels={["Starter", "Professional", "Enterprise"]}
                        values={[30, 65, 100]}
                        color="#4F46E5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {key === "digitalMarketing" && (
                <div style={{ padding: "0 64px 48px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "28px", border: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "20px" }}>📱 Marketing Channel Mix</div>
                      <DoughnutChart
                        title="Channel Mix"
                        labels={["SEO", "Paid Ads", "Social Media", "Content", "Email"]}
                        values={[30, 25, 20, 15, 10]}
                        colors={["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981"]}
                      />
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "28px", border: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "20px" }}>📈 Projected Growth (6 Months)</div>
                      <LineChart
                        title="Growth"
                        labels={["M1", "M2", "M3", "M4", "M5", "M6"]}
                        datasets={[
                          { label: "Organic Traffic", data: [100, 150, 220, 310, 430, 600], color: "#4F46E5" },
                          { label: "Conversions", data: [10, 18, 28, 42, 60, 85], color: "#10B981" }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}
              {key === "projectOverview" && (
                <div style={{ padding: "0 64px 48px" }}>
                  <ArchitectureDiagram markdown={sections[key]} />
                  <TimelineVisual markdown={sections[key]} />
                </div>
              )}

              {key === "technologyStack" && (
                <div style={{ padding: "0 64px 48px" }}>
                  {parseTechTable(sections[key]) ? (
                    <TechStackVisual markdown={sections[key]} />
                  ) : (
                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "32px", border: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "24px" }}>🔧 Tech Stack Architecture</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                        {[
                          { layer: "Frontend", tech: "React / Next.js", color: "#0EA5E9", icon: "⚛️" },
                          { layer: "Backend", tech: "Node.js / Express", color: "#10B981", icon: "🔙" },
                          { layer: "Database", tech: "PostgreSQL / Redis", color: "#F59E0B", icon: "🗄️" },
                          { layer: "Cloud", tech: "AWS / GCP", color: "#EF4444", icon: "☁️" },
                          { layer: "Mobile", tech: "React Native", color: "#8B5CF6", icon: "📱" },
                          { layer: "Security", tech: "SSL / OAuth 2.0", color: "#6B7280", icon: "🔒" },
                          { layer: "DevOps", tech: "Docker / CI-CD", color: "#EC4899", icon: "🚀" },
                          { layer: "AI/ML", tech: "OpenAI / TensorFlow", color: "#4F46E5", icon: "🤖" }
                        ].map((t, i) => (
                          <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px 14px", border: `1px solid ${t.color}30`, borderTop: `3px solid ${t.color}` }}>
                            <div style={{ fontSize: "1.3rem", marginBottom: "8px" }}>{t.icon}</div>
                            <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{t.layer}</div>
                            <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1e293b" }}>{t.tech}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {key === "features" && (
                <div style={{ padding: "0 64px 48px" }}>
                  <div style={{ background: "linear-gradient(135deg, #f8fafc, #eff6ff)", borderRadius: "14px", padding: "28px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "20px" }}>⚡ Platform Feature Highlights</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      {[
                        { icon: "🔐", feat: "Multi-level Authentication" },
                        { icon: "📊", feat: "Real-time Analytics Dashboard" },
                        { icon: "💳", feat: "Payment Gateway Integration" },
                        { icon: "📧", feat: "Automated Email & SMS" },
                        { icon: "🌐", feat: "Multi-language Support" },
                        { icon: "📱", feat: "iOS & Android Apps" },
                        { icon: "🔔", feat: "Push Notifications" },
                        { icon: "🗺️", feat: "Google Maps Integration" },
                        { icon: "📝", feat: "Admin CMS Dashboard" }
                      ].map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "white", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                          <span style={{ fontSize: "1.2rem" }}>{f.icon}</span>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{f.feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {key === "executiveSummary" && (
                <div style={{ padding: "0 64px 48px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {[
                      { icon: "🎯", title: "Clear Vision", desc: "Tailor-made solution aligned with your business goals" },
                      { icon: "🚀", title: "Fast Delivery", desc: "Agile methodology ensuring on-time project completion" },
                      { icon: "💎", title: "Premium Quality", desc: "Enterprise-grade standards with full ownership transfer" }
                    ].map((c, i) => (
                      <div key={i} style={{ background: "linear-gradient(135deg, #f8fafc, #eff6ff)", borderRadius: "12px", padding: "24px 20px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{c.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b", marginBottom: "8px" }}>{c.title}</div>
                        <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6 }}>{c.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 64px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                <span style={{ fontSize: "0.68rem", color: "#94a3b8", letterSpacing: "0.5px" }}>TechVision Solutions — Confidential & Proprietary</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: color }}>Section {idx + 1} / {activeSections.length}</span>
              </div>
            </div>
          );
        })}

        {/* ══════════════════════════════════════════════════════════════
            FINAL PAGE — THANK YOU + SIGNATURE
        ══════════════════════════════════════════════════════════════ */}
        <div className="section-page" style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <div style={{ background: themeColors.coverBg, padding: "80px 72px", position: "relative", overflow: "hidden" }}>
            {/* Blobs */}
            <div style={{ position: "absolute", top: "-100px", right: "-80px", width: "450px", height: "450px", borderRadius: "50%", background: themeColors.primary + "30", filter: "blur(80px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "380px", height: "380px", borderRadius: "50%", background: themeColors.secondary + "20", filter: "blur(70px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              {/* Gradient accent */}
              <div style={{ width: "80px", height: "4px", background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`, borderRadius: "2px", margin: "0 auto 40px" }} />

              <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "3rem", color: "white", lineHeight: 1.15, marginBottom: "20px" }}>
                  Let's Build Something<br />
                  <span style={{ background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary}, #f472b6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Extraordinary Together.
                  </span>
                </div>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "48px" }}>
                  We are excited about the opportunity to partner with {proposal.clientName}. This proposal represents our full commitment to delivering world-class results for {proposal.projectName}.
                </p>

                {/* Signature grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "28px" }}>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Client Acceptance</div>
                    <div style={{ height: "56px", borderBottom: "1px solid rgba(255,255,255,0.2)", marginBottom: "8px", display: "flex", alignItems: "flex-end", paddingBottom: "6px" }}>
                      {proposal.signatureUrl && <img src={proposal.signatureUrl} alt="Signature" style={{ height: "44px", objectFit: "contain" }} />}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Signature & Date</div>
                    <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", marginTop: "8px" }}>{proposal.clientName}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "28px" }}>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Authorized By</div>
                    <div style={{ height: "56px", borderBottom: "1px solid rgba(255,255,255,0.2)", marginBottom: "8px" }} />
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Signature & Date</div>
                    <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", marginTop: "8px" }}>TechVision Solutions</div>
                  </div>
                </div>

                {/* Validity notice */}
                <div style={{ background: themeColors.primary + "20", border: `1px solid ${themeColors.primary}50`, borderRadius: "10px", padding: "14px 20px", marginBottom: "40px" }}>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>
                    ⏳ This proposal is valid for <strong style={{ color: "white" }}>30 days</strong> from the date of issue.
                  </span>
                </div>
              </div>

              {/* Contact row */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {[
                  { icon: "📧", label: "Email", val: "hello@techvisionsolutions.com" },
                  { icon: "📞", label: "Phone", val: "+1 (800) 555-0100" },
                  { icon: "🌐", label: "Website", val: "www.techvisionsolutions.com" }
                ].map((c, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{c.icon}</div>
                    <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>{c.label}</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>{c.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: "6px", background: themeColors.dots }} />
        </div>

      </div>
    </div>
  );
}
