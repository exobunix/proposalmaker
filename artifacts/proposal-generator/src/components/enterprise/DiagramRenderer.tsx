import React from "react";
import { useIndustryTheme } from "./ThemeProvider";

interface DiagramRendererProps {
  format: "architecture" | "userflow" | "database" | "deployment";
  data: any;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ format, data }) => {
  const { theme } = useIndustryTheme();

  if (!data || !Array.isArray(data)) return null;

  const renderArchitecture = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", marginTop: "32px" }}>
        {data.map((layer: any, idx: number) => (
          <div key={idx} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "640px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderLeft: `6px solid ${layer.color || theme.primary}`,
                borderRadius: "14px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: `${layer.color || theme.primary}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  flexShrink: 0
                }}
              >
                {layer.icon || "⚙️"}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    fontWeight: 800
                  }}
                >
                  {layer.label}
                </div>
                <div style={{ fontSize: "0.9rem", color: theme.textDark, fontWeight: 700, marginTop: "4px" }}>
                  {layer.text}
                </div>
              </div>
            </div>
            {idx < data.length - 1 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" }}>
                <div style={{ width: "2px", height: "16px", background: "#cbd5e1" }} />
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M 0 0 L 5 5 L 10 0" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderUserFlow = () => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "32px" }}>
        {data.map((step: any, idx: number) => (
          <div
            key={idx}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "24px",
              position: "relative",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: `${theme.primary}15`,
                color: theme.primary,
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 800
              }}
            >
              {step.step || idx + 1}
            </div>
            <div style={{ fontWeight: 800, color: theme.textDark, marginBottom: "8px", fontSize: "0.95rem", paddingRight: "24px" }}>
              {step.label}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDatabase = () => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "32px" }}>
        {data.map((table: any, idx: number) => (
          <div
            key={idx}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                color: "#ffffff",
                padding: "12px 18px",
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              🗄️ {table.tableName || table.name}
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "8px", fontStyle: "italic" }}>
                {table.description || "Database Table Schema"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {table.columns?.map((col: any, cIdx: number) => (
                  <div key={cIdx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px dashed #f1f5f9", paddingBottom: "4px" }}>
                    <span style={{ fontWeight: 700, color: theme.textDark }}>
                      {col.name} {col.pk && "🔑"} {col.fk && "🔗"}
                    </span>
                    <span style={{ color: "#64748b", fontFamily: "monospace" }}>{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDeployment = () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px", marginTop: "32px" }}>
        {data.map((node: any, idx: number) => (
          <div
            key={idx}
            style={{
              flex: "1 1 200px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{node.icon || "☁️"}</div>
            <div style={{ fontWeight: 800, color: theme.textDark, fontSize: "0.9rem", marginBottom: "4px" }}>
              {node.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: theme.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {node.type}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
              {node.desc}
            </div>
          </div>
        ))}
      </div>
    );
  };

  switch (format) {
    case "userflow":
      return renderUserFlow();
    case "database":
      return renderDatabase();
    case "deployment":
      return renderDeployment();
    case "architecture":
    default:
      return renderArchitecture();
  }
};
