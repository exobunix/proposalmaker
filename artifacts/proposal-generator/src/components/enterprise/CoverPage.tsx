import React from "react";
import { useIndustryTheme, MotifBackground } from "./ThemeProvider";
import { format } from "date-fns";

interface CoverPageProps {
  clientName: string;
  projectName: string;
  projectDate?: string;
  logoUrl?: string;
  authorName?: string;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  clientName,
  projectName,
  projectDate,
  logoUrl,
  authorName
}) => {
  const { theme } = useIndustryTheme();
  let dateStr = "";
  try {
    const d = projectDate ? new Date(projectDate) : new Date();
    dateStr = isNaN(d.getTime()) ? format(new Date(), "MMMM d, yyyy") : format(d, "MMMM d, yyyy");
  } catch (e) {
    dateStr = format(new Date(), "MMMM d, yyyy");
  }

  return (
    <div
      style={{
        background: theme.coverBg,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        color: theme.textLight,
        position: "relative",
        overflow: "hidden"
      }}
      className="enterprise-cover"
    >
      {/* Decorative SVG Motif */}
      <MotifBackground motif={theme.motif} color={theme.primary} />

      {/* Top Banner and Logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ height: "45px", objectFit: "contain" }} />
        ) : (
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "2px" }}>
            {(authorName || "TechVision Solutions").toUpperCase()}
          </div>
        )}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "1.5px",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}
        >
          CONFIDENTIAL
        </div>
      </div>

      {/* Main Title & Description */}
      <div style={{ zIndex: 10, margin: "auto 0" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          <div style={{ width: "60px", height: "4px", background: theme.primary, borderRadius: "2px" }} />
          <div style={{ width: "24px", height: "4px", background: theme.secondary, borderRadius: "2px" }} />
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "4px",
            color: theme.primary,
            textTransform: "uppercase",
            marginBottom: "16px"
          }}
        >
          Business Proposal
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: "3.5rem",
            lineHeight: 1.1,
            marginBottom: "16px",
            textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            color: theme.textLight || "#FFFFFF"
          }}
        >
          {projectName}
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 300,
            maxWidth: "600px",
            lineHeight: 1.6
          }}
        >
          A comprehensive digital transformational framework prepared for {clientName}.
        </p>
      </div>

      {/* Footer Info */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          zIndex: 10,
          fontSize: "0.85rem"
        }}
      >
        <div>
          <div style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.68rem", marginBottom: "4px" }}>
            Prepared For
          </div>
          <div style={{ fontWeight: 700 }}>{clientName}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.68rem", marginBottom: "4px" }}>
            Date of Proposal
          </div>
          <div style={{ fontWeight: 700 }}>{dateStr}</div>
        </div>
      </div>
    </div>
  );
};
