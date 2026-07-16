import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { useIndustryTheme } from "./ThemeProvider";

interface ChartRendererProps {
  type: "pie" | "bar" | "line" | "gantt";
  data: any[];
  title?: string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, title }) => {
  const { theme } = useIndustryTheme();

  if (!data || data.length === 0) return null;

  const COLORS = [theme.primary, theme.secondary, theme.accent, "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

  const renderPie = () => {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderBar = () => {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="value" fill={theme.primary} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLine = () => {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="value" stroke={theme.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          {data[0] && Object.keys(data[0]).includes("value2") && (
            <Line type="monotone" dataKey="value2" stroke={theme.secondary} strokeWidth={2} dot={{ r: 3 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderGantt = () => {
    // Gantt simulation using horizontal bar chart
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" stroke="#94a3b8" fontSize={11} />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          <Bar dataKey="duration" fill={theme.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChartContent = () => {
    switch (type) {
      case "pie":
        return renderPie();
      case "line":
        return renderLine();
      case "gantt":
        return renderGantt();
      case "bar":
      default:
        return renderBar();
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        marginTop: "24px"
      }}
      className="enterprise-chart-card"
    >
      {title && (
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: "1rem",
            color: theme.textDark,
            marginBottom: "20px"
          }}
        >
          {title}
        </div>
      )}
      {renderChartContent()}
    </div>
  );
};
