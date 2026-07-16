import React, { createContext, useContext } from "react";

export interface IndustryTheme {
  primary: string;
  secondary: string;
  accent: string;
  textDark: string;
  textLight: string;
  bgLight: string;
  coverBg: string;
  dots: string;
  motif: string;
}

export const INDUSTRY_THEMES: Record<string, IndustryTheme> = {
  Healthcare: {
    primary: "#06B6D4",
    secondary: "#3B82F6",
    accent: "#0D9488",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#F0FDFA",
    coverBg: "linear-gradient(135deg, #083344 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #06B6D4, #3B82F6, #60A5FA, #0891B2)",
    motif: "medical"
  },
  Fintech: {
    primary: "#10B981",
    secondary: "#4F46E5",
    accent: "#059669",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#ECFDF5",
    coverBg: "linear-gradient(135deg, #064E3B 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #10B981, #4F46E5, #34D399, #6366F1)",
    motif: "finance"
  },
  "Real Estate": {
    primary: "#F59E0B",
    secondary: "#78350F",
    accent: "#D97706",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#FEF3C7",
    coverBg: "linear-gradient(135deg, #451A03 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #F59E0B, #78350F, #FBBF24, #D97706)",
    motif: "property"
  },
  Legal: {
    primary: "#1E3A8A",
    secondary: "#B45309",
    accent: "#1E40AF",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#EFF6FF",
    coverBg: "linear-gradient(135deg, #030712 0%, #172554 100%)",
    dots: "linear-gradient(90deg, #1E3A8A, #B45309, #3B82F6, #D97706)",
    motif: "corporate"
  },
  Education: {
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#7C3AED",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#F5F3FF",
    coverBg: "linear-gradient(135deg, #2E1065 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #8B5CF6, #EC4899, #A78BFA, #F472B6)",
    motif: "academic"
  },
  Technology: {
    primary: "#4F46E5",
    secondary: "#7C3AED",
    accent: "#6366F1",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#EEF2F6",
    coverBg: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
    dots: "linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #F59E0B)",
    motif: "tech"
  },
  Manufacturing: {
    primary: "#4B5563",
    secondary: "#EA580C",
    accent: "#374151",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#F3F4F6",
    coverBg: "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
    dots: "linear-gradient(90deg, #4B5563, #EA580C, #9CA3AF, #F97316)",
    motif: "industrial"
  },
  Agriculture: {
    primary: "#16A34A",
    secondary: "#854D0E",
    accent: "#15803D",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#F0FDF4",
    coverBg: "linear-gradient(135deg, #062F14 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #16A34A, #854D0E, #4ADE80, #A16207)",
    motif: "nature"
  },
  IoT: {
    primary: "#0891B2",
    secondary: "#10B981",
    accent: "#06B6D4",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#ECFEFF",
    coverBg: "linear-gradient(135deg, #164E63 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #0891B2, #10B981, #22D3EE, #34D399)",
    motif: "hardware"
  },
  Restaurant: {
    primary: "#E11D48",
    secondary: "#D97706",
    accent: "#BE123C",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#FFF1F2",
    coverBg: "linear-gradient(135deg, #4C0519 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #E11D48, #D97706, #F43F5E, #FBBF24)",
    motif: "food"
  },
  Construction: {
    primary: "#EAB308",
    secondary: "#374151",
    accent: "#CA8A04",
    textDark: "#0F172A",
    textLight: "#FFFFFF",
    bgLight: "#FEFCE8",
    coverBg: "linear-gradient(135deg, #422006 0%, #0F172A 100%)",
    dots: "linear-gradient(90deg, #EAB308, #374151, #FDE047, #4B5563)",
    motif: "build"
  }
};

interface ThemeContextProps {
  theme: IndustryTheme;
  industry: string;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: INDUSTRY_THEMES.Technology,
  industry: "Technology"
});

export const ThemeProvider: React.FC<{ industry?: string; children: React.ReactNode }> = ({
  industry = "Technology",
  children
}) => {
  const selectedTheme = INDUSTRY_THEMES[industry] || INDUSTRY_THEMES.Technology;

  return (
    <ThemeContext.Provider value={{ theme: selectedTheme, industry }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useIndustryTheme = () => useContext(ThemeContext);

export const MotifBackground: React.FC<{ motif: string; color: string }> = ({ motif, color }) => {
  switch (motif) {
    case "medical":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="50" fill={color} />
          <circle cx="90%" cy="80%" r="80" fill={color} />
          <path d="M 0 50 Q 25 100 50 50 T 100 50" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
    case "finance":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="90%" x2="100%" y2="90%" stroke={color} strokeWidth="2" />
          <path d="M0,80 Q20,50 40,70 T80,40 T120,60" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
    case "nature":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,150 C100,100 200,200 300,150 S500,50 600,150 L600,300 L0,300 Z" fill={color} />
        </svg>
      );
    case "tech":
    default:
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      );
  }
};
