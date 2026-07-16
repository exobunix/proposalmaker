import React from "react";
import { useIndustryTheme } from "./ThemeProvider";

interface CustomSvgIconProps {
  name: string;
  color: string;
  size?: number;
}

export const CustomSvgIcon: React.FC<CustomSvgIconProps> = ({ name, color, size = 24 }) => {
  const normName = name.toLowerCase();

  const getSvgContent = () => {
    switch (normName) {
      case "security":
      case "lock":
      case "shield":
        return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      case "speed":
      case "bolt":
      case "lightning":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      case "data":
      case "database":
      case "storage":
        return (
          <>
            <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="2" fill="none" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth="2" fill="none" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" strokeWidth="2" fill="none" />
          </>
        );
      case "cloud":
      case "hosting":
      case "server":
        return <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" strokeWidth="2" fill="none" />;
      case "target":
      case "goal":
      case "vision":
        return (
          <>
            <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="6" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="2" strokeWidth="2" fill="none" />
          </>
        );
      case "ai":
      case "robot":
      case "brain":
        return (
          <>
            <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2" fill="none" />
            <circle cx="12" cy="5" r="2" strokeWidth="2" fill="none" />
            <path d="M12 7v4" strokeWidth="2" />
            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" strokeLinecap="round" />
            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case "mobile":
      case "phone":
      case "app":
        return (
          <>
            <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" fill="none" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case "chart":
      case "analytics":
      case "growth":
        return (
          <>
            <line x1="18" y1="20" x2="18" y2="10" strokeWidth="2" />
            <line x1="12" y1="20" x2="12" y2="4" strokeWidth="2" />
            <line x1="6" y1="20" x2="6" y2="14" strokeWidth="2" />
          </>
        );
      case "team":
      case "users":
      case "support":
        return (
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" fill="none" />
            <circle cx="9" cy="7" r="4" strokeWidth="2" fill="none" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
          </>
        );
      default:
        // Settings / gear icon as fallback
        return (
          <>
            <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2" fill="none" />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {getSvgContent()}
    </svg>
  );
};

interface CardProps {
  title: string;
  description: string;
  iconName?: string;
  variant?: "info" | "callout" | "highlight" | "stat";
  statValue?: string;
}

export const FeatureCard: React.FC<CardProps> = ({
  title,
  description,
  iconName = "settings",
  variant = "info",
  statValue
}) => {
  const { theme } = useIndustryTheme();

  const styles = {
    info: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderTop: `4px solid ${theme.primary}`
    },
    callout: {
      background: `linear-gradient(135deg, ${theme.primary}08, ${theme.primary}12)`,
      border: `1px solid ${theme.primary}30`,
      borderLeft: `5px solid ${theme.primary}`
    },
    highlight: {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      border: "none",
      color: "#ffffff"
    },
    stat: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderLeft: `4px solid ${theme.secondary}`
    }
  };

  const selectedStyle = styles[variant];
  const isDarkText = variant !== "highlight";

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease-in-out",
        height: "100%",
        ...selectedStyle
      }}
      className={`feature-card-${variant}`}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          {iconName && (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: variant === "highlight" ? "rgba(255, 255, 255, 0.2)" : `${theme.primary}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CustomSvgIcon name={iconName} color={variant === "highlight" ? "#ffffff" : theme.primary} size={20} />
            </div>
          )}
          {variant === "stat" && statValue && (
            <div style={{ fontSize: "2rem", fontWeight: 800, color: theme.secondary, fontFamily: "'Playfair Display', serif" }}>
              {statValue}
            </div>
          )}
        </div>

        <h4
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: isDarkText ? theme.textDark : "#ffffff",
            marginBottom: "8px"
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: "0.85rem",
            color: isDarkText ? "#475569" : "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.5
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
