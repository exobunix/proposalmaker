import React from "react";
import { useIndustryTheme } from "./ThemeProvider";

export interface TimelineItem {
  phase: string;
  duration: string;
  deliverables: string | string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const { theme } = useIndustryTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "32px", position: "relative" }}>
      {/* Visual Connecting Bar */}
      <div
        style={{
          position: "absolute",
          left: "23px",
          top: "8px",
          bottom: "8px",
          width: "2px",
          background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`,
          opacity: 0.3
        }}
      />

      {items.map((item, idx) => (
        <div key={idx} style={{ display: "flex", gap: "24px", position: "relative" }}>
          {/* Milestone Circle */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#ffffff",
              border: `3px solid ${idx % 2 === 0 ? theme.primary : theme.secondary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: idx % 2 === 0 ? theme.primary : theme.secondary }}>
              {String(idx + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Delivery Details Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px"
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 800, fontSize: "0.95rem", color: theme.textDark, marginBottom: "8px" }}>
                {item.phase}
              </h4>
              <div style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6 }}>
                {Array.isArray(item.deliverables) ? (
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                    {item.deliverables.map((d, dIdx) => (
                      <li key={dIdx}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  item.deliverables
                )}
              </div>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                color: "#ffffff",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: `0 4px 10px ${theme.primary}40`
              }}
            >
              {item.duration}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
