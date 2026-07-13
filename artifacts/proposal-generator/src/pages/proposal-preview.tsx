import { useParams, Link } from "wouter";
import { useGetProposal, getGetProposalQueryKey } from "@workspace/api-client-react";
import { Loader2, ArrowLeft, Printer, CheckCircle, Star, Zap, Shield, Clock, Users, TrendingUp, Award, Code, Globe, Smartphone, Database, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { markdownToHtml } from "@/lib/markdown";

export default function ProposalPreview() {
  const params = useParams();
  const id = parseInt(params.id!);

  const { data: proposal, isLoading } = useGetProposal(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProposalQueryKey(id)
    }
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !proposal) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading your proposal...</p>
        </div>
      </div>
    );
  }

  const sections = (proposal.sections || {}) as Record<string, string>;
  const enabledSections = (proposal.enabledSections || {}) as Record<string, boolean>;

  const sectionOrder = [
    'executiveSummary', 'aboutCompany', 'projectOverview', 'features',
    'technologyStack', 'pricing', 'digitalMarketing', 'addOns',
    'legalTerms', 'acceptanceSection'
  ];

  const sectionTitles: Record<string, string> = {
    executiveSummary: "Executive Summary",
    aboutCompany: "About Us",
    projectOverview: "Project Overview",
    features: "Key Features & Modules",
    technologyStack: "Technology Stack",
    pricing: "Investment & Pricing",
    digitalMarketing: "Digital Marketing Strategy",
    addOns: "Optional Add-On Services",
    legalTerms: "Terms & Conditions",
    acceptanceSection: "Acceptance & Sign-Off"
  };

  const sectionIcons: Record<string, string> = {
    executiveSummary: "📋",
    aboutCompany: "🏢",
    projectOverview: "🎯",
    features: "⚡",
    technologyStack: "🔧",
    pricing: "💰",
    digitalMarketing: "📈",
    addOns: "🚀",
    legalTerms: "⚖️",
    acceptanceSection: "✍️"
  };

  const sectionColors: Record<string, string> = {
    executiveSummary: "#4F46E5",
    aboutCompany: "#7C3AED",
    projectOverview: "#0EA5E9",
    features: "#10B981",
    technologyStack: "#F59E0B",
    pricing: "#EF4444",
    digitalMarketing: "#8B5CF6",
    addOns: "#EC4899",
    legalTerms: "#6B7280",
    acceptanceSection: "#059669"
  };

  const activeSections = sectionOrder.filter(key => enabledSections[key] !== false && sections[key]);

  const stats = [
    { label: "Sections", value: activeSections.length, icon: "📄" },
    { label: "Project Type", value: proposal.projectType?.split(" ")[0] || "Custom", icon: "💡" },
    { label: "Industry", value: proposal.clientIndustry?.split(" ")[0] || "Tech", icon: "🏭" },
    { label: "Prepared By", value: "TechVision", icon: "🏆" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap');
        
        * { box-sizing: border-box; }
        
        body { font-family: 'Inter', sans-serif; }
        
        .proposal-doc {
          font-family: 'Inter', sans-serif;
        }
        
        .proposal-heading {
          font-family: 'Playfair Display', serif;
        }

        .section-content h1, .section-content h2, .section-content h3, .section-content h4 {
          font-family: 'Playfair Display', serif;
          color: #1e293b;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .section-content h1 { font-size: 1.6rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
        .section-content h2 { font-size: 1.3rem; color: #2563eb; }
        .section-content h3 { font-size: 1.1rem; color: #475569; }
        .section-content h4 { font-size: 1rem; color: #334155; }

        .section-content p {
          color: #374151;
          line-height: 1.85;
          margin-bottom: 0.9rem;
          font-size: 0.95rem;
        }
        
        .section-content ul, .section-content ol {
          padding-left: 1.4rem;
          margin-bottom: 1rem;
          space-y: 0.5rem;
        }
        
        .section-content li {
          color: #374151;
          line-height: 1.7;
          margin-bottom: 0.4rem;
          font-size: 0.93rem;
        }

        .section-content li::marker {
          color: #4F46E5;
        }

        .section-content strong {
          color: #1e293b;
          font-weight: 700;
        }
        
        .section-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.88rem;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 8px rgba(0,0,0,0.08);
        }
        
        .section-content table thead tr {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white;
        }
        
        .section-content table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 0.83rem;
          text-transform: uppercase;
        }
        
        .section-content table td {
          padding: 11px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #374151;
        }
        
        .section-content table tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .section-content table tbody tr:hover {
          background: #eff6ff;
        }
        
        .section-content hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }

        .section-content blockquote {
          border-left: 4px solid #4F46E5;
          background: #eff6ff;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
        }

        .section-content code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85em;
          color: #7C3AED;
        }

        .proposal-page-break {
          page-break-after: always;
        }

        @media print {
          .no-print { display: none !important; }
          .print-page { min-height: 100vh; page-break-after: always; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .proposal-doc { box-shadow: none !important; }
        }
      `}</style>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 no-print" style={{ background: "white", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href={`/proposals/${id}`}>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">{proposal.clientName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{proposal.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">{activeSections.length} sections ready</span>
            <Button onClick={handlePrint} style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", border: "none" }} className="text-white shadow-lg">
              <Printer className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Document Wrapper */}
      <div className="py-8 px-4 no-print">
        <div className="proposal-doc max-w-[900px] mx-auto shadow-2xl rounded-2xl overflow-hidden">

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* COVER PAGE */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="print-page relative overflow-hidden" style={{
            minHeight: "1100px",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(79,70,229,0.2)", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", top: "40%", left: "60%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(14,165,233,0.1)", filter: "blur(50px)" }} />

            {/* Header strip */}
            <div style={{ padding: "48px 64px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
              {proposal.logoUrl ? (
                <img src={proposal.logoUrl} alt="Company Logo" style={{ height: "52px", objectFit: "contain" }} />
              ) : (
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "white", letterSpacing: "2px" }}>
                  TECHVISION
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>DATE</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  {format(new Date(proposal.projectDate || new Date()), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>

            {/* Main Cover Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", position: "relative", zIndex: 2 }}>
              <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899)", borderRadius: "2px", marginBottom: "40px" }} />
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "20px", fontWeight: 500 }}>
                BUSINESS PROPOSAL — CONFIDENTIAL
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4.2rem", fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.02em" }}>
                {proposal.clientName}
              </h1>
              <p style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.7)", fontWeight: 300, marginBottom: "48px", letterSpacing: "0.01em" }}>
                {proposal.projectName}
              </p>

              {/* Stats bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    padding: "16px",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{stat.icon}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "white", marginBottom: "2px" }}>{stat.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "40px 64px 48px", position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Prepared For</div>
                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{proposal.clientName}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{proposal.clientIndustry} Industry</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Prepared By</div>
                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>TechVision Solutions</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>hello@techvisionsolutions.com</div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TABLE OF CONTENTS */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeSections.length > 0 && (
            <div className="print-page" style={{ minHeight: "1100px", background: "white", padding: "80px 72px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "60px" }}>
                <div style={{ width: "6px", height: "48px", background: "linear-gradient(180deg, #4F46E5, #7C3AED)", borderRadius: "3px" }} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>Navigation</div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Table of Contents</h2>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {activeSections.map((key, index) => (
                  <div key={key} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    background: index % 2 === 0 ? "#f8fafc" : "white",
                    border: "1px solid #f1f5f9",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${sectionColors[key]}`
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: `${sectionColors[key]}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0
                    }}>
                      {sectionIcons[key]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "1px" }}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>
                        {sectionTitles[key] || key}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Why Us quick stats */}
              <div style={{ marginTop: "60px", padding: "32px", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: "16px", color: "white" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "24px", color: "white" }}>Why Partner With TechVision Solutions?</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                  {[
                    { icon: "🏆", title: "8+ Years", sub: "Industry Experience" },
                    { icon: "✅", title: "200+ Projects", sub: "Successfully Delivered" },
                    { icon: "⭐", title: "98% Rate", sub: "Client Satisfaction" },
                    { icon: "🌍", title: "30+ Countries", sub: "Global Reach" },
                    { icon: "👥", title: "50+ Experts", sub: "Dedicated Team" },
                    { icon: "🔒", title: "ISO 27001", sub: "Security Certified" }
                  ].map((item, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{item.icon}</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "2px" }}>{item.title}</div>
                      <div style={{ fontSize: "0.72rem", opacity: 0.75, letterSpacing: "0.5px" }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SECTIONS */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeSections.map((key, idx) => {
            const color = sectionColors[key];
            const icon = sectionIcons[key];
            const isEven = idx % 2 === 0;

            return (
              <div key={key} className="print-page" style={{ minHeight: "1100px", background: "white" }}>
                {/* Section Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${color}08, ${color}18)`,
                  borderBottom: `3px solid ${color}30`,
                  padding: "60px 72px 40px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      boxShadow: `0 8px 20px ${color}40`
                    }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.65rem", color: "#9ca3af", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>
                        Section {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "2.2rem",
                        fontWeight: 800,
                        color: "#1e293b",
                        margin: 0,
                        lineHeight: 1.1
                      }}>
                        {sectionTitles[key] || key}
                      </h2>
                    </div>
                  </div>
                  {/* Decorative line */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                    <div style={{ width: "40px", height: "3px", background: color, borderRadius: "2px" }} />
                    <div style={{ width: "20px", height: "3px", background: `${color}60`, borderRadius: "2px" }} />
                    <div style={{ width: "10px", height: "3px", background: `${color}30`, borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Section Body */}
                <div style={{ padding: "48px 72px 60px" }}>
                  <div
                    className="section-content"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(sections[key]) }}
                  />
                </div>

                {/* Section Footer */}
                <div style={{
                  padding: "20px 72px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#fafbfc"
                }}>
                  <span style={{ fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "1px" }}>TechVision Solutions — Confidential</span>
                  <span style={{ fontSize: "0.7rem", color: color, fontWeight: 600 }}>Page {idx + 3}</span>
                </div>
              </div>
            );
          })}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* FINAL SIGNATURE / THANK YOU PAGE */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="print-page" style={{
            minHeight: "1100px",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "80px 72px",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* BG decoration */}
            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(79,70,229,0.15)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(124,58,237,0.12)", filter: "blur(70px)" }} />

            {/* Logo */}
            <div style={{ position: "relative", zIndex: 2 }}>
              {proposal.logoUrl ? (
                <img src={proposal.logoUrl} alt="Logo" style={{ height: "48px", objectFit: "contain" }} />
              ) : (
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "white", letterSpacing: "2px" }}>TECHVISION</div>
              )}
            </div>

            {/* Thank you message */}
            <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #4F46E5, #EC4899)", borderRadius: "2px", margin: "0 auto 40px" }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: 800, color: "white", marginBottom: "20px", lineHeight: 1.1 }}>
                Let's Build Something<br /><span style={{ background: "linear-gradient(90deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Extraordinary.</span>
              </h2>
              <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", maxWidth: "480px", margin: "0 auto 50px", lineHeight: 1.7 }}>
                We're excited about the opportunity to partner with {proposal.clientName}. This proposal represents our full commitment to delivering outstanding results.
              </p>

              {/* Signature area */}
              {proposal.contactDetails && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "640px", margin: "0 auto 40px" }}>
                  <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "28px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Client Acceptance</div>
                    <div style={{ height: "60px", borderBottom: "1px solid rgba(255,255,255,0.2)", marginBottom: "8px", display: "flex", alignItems: "flex-end", paddingBottom: "8px" }}>
                      {proposal.signatureUrl && (
                        <img src={proposal.signatureUrl} alt="Signature" style={{ height: "48px", objectFit: "contain" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Signature / Date</div>
                    <div style={{ fontSize: "0.9rem", color: "white", fontWeight: 600, marginTop: "8px" }}>{proposal.clientName}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "28px" }}>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Authorized By</div>
                    <div style={{ height: "60px", borderBottom: "1px solid rgba(255,255,255,0.2)", marginBottom: "8px" }} />
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Signature / Date</div>
                    <div style={{ fontSize: "0.9rem", color: "white", fontWeight: 600, marginTop: "8px" }}>TechVision Solutions</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact footer */}
            <div style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {[
                { icon: "📧", label: "Email", value: "hello@techvisionsolutions.com" },
                { icon: "📞", label: "Phone", value: "+1 (800) 555-0100" },
                { icon: "🌐", label: "Website", value: "www.techvisionsolutions.com" }
              ].map((c, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "6px" }}>{c.icon}</div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>{c.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Print-only version */}
      <div className="hidden print:block print-only-content">
        {activeSections.map((key) => (
          <div key={key} style={{ pageBreakAfter: "always", padding: "60px", fontFamily: "Georgia, serif" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1e293b", borderBottom: "2px solid #4F46E5", paddingBottom: "12px", marginBottom: "24px" }}>
              {sectionTitles[key] || key}
            </h2>
            <div
              className="section-content"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(sections[key]) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
