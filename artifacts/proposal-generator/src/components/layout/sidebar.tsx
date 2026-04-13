import { Link, useLocation } from "wouter";
import { FileText, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
  ];

  return (
    <div className="w-64 border-r border-border bg-sidebar h-screen flex flex-col no-print">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <FileText className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-sidebar-foreground">Proposa</span>
        </div>
      </div>
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-mono text-sidebar-foreground/50 mb-2 px-2 uppercase tracking-wider">Menu</div>
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.title}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground w-full transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
