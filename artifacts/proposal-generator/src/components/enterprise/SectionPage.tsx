import React from "react";
import { useIndustryTheme, MotifBackground } from "./ThemeProvider";

interface SectionPageProps {
  id: string;
  sectionIndex: number;
  totalSections: number;
  sectionTitle: string;
  emoji?: string;
  children: React.ReactNode;
  isPrintMode?: boolean;
  authorName?: string;
}

export const SectionPage: React.FC<SectionPageProps> = ({
  id,
  sectionIndex,
  totalSections,
  sectionTitle,
  emoji,
  children,
  isPrintMode = false,
  authorName
}) => {
  const { theme } = useIndustryTheme();

  return (
    <div
      id={`section-${id}`}
      style={{
        background: isPrintMode ? "#FFFFFF" : "white",
        minHeight: isPrintMode ? "297mm" : "auto", // standard A4 height in print
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        borderBottom: isPrintMode ? "none" : "1px solid #e2e8f0",
        boxShadow: isPrintMode ? "none" : "0 4px 6px -1px rgba(0,0,0,0.05)"
      }}
      className="section-page"
    >
      {/* Dynamic Background Motif */}
      <MotifBackground motif={theme.motif} color={theme.primary} />

      {/* running header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 64px 16px",
          borderBottom: "1px solid #f1f5f9",
          zIndex: 10
        }}
      >
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>
          TechVision Framework
        </span>
        <span style={{ fontSize: "0.65rem", color: "#94a3b8", letterSpacing: "1px" }}>
          CONFIDENTIAL
        </span>
      </div>

      {/* section content container */}
      <div style={{ flex: 1, padding: "40px 64px 52px", zIndex: 10 }}>
        {/* Section title header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          {emoji && (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: theme.primary,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                boxShadow: `0 8px 20px ${theme.primary}30`
              }}
            >
              {emoji}
            </div>
          )}
          <div>
            <div style={{ fontSize: "0.6rem", color: "#94a3b8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px" }}>
              Section {String(sectionIndex).padStart(2, "0")}
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "1.8rem",
                color: theme.textDark,
                lineHeight: 1.1
              }}
            >
              {sectionTitle}
            </h2>
          </div>
        </div>

        {/* content body */}
        <div className="proposal-body" style={{ color: "#334155", fontSize: "0.92rem", lineHeight: 1.6 }}>
          {children}
        </div>
      </div>

      {/* running footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 64px",
          borderTop: "1px solid #f1f5f9",
          background: "#fafbfc",
          zIndex: 10
        }}
      >
        <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>
          © {authorName || "TechVision Solutions"} — Proprietary & Confidential
        </span>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.primary }}>
          {sectionIndex} / {totalSections}
        </span>
      </div>
    </div>
  );
};
