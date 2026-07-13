import { Link, useLocation } from "wouter";
import { FileText, LayoutDashboard, Settings, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

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
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/10">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">Proposa</span>
        </div>
      </div>
      <div className="flex-1 py-6 px-4 flex flex-col gap-2 justify-between">
        <div className="flex flex-col gap-2">
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

        {user && (
          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/30 space-y-2.5">
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-xs font-medium text-muted-foreground truncate">{user.email}</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border-amber-500/30 text-amber-600 bg-amber-500/5">
                  {user.subscription} Plan
                </Badge>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full text-xs font-medium text-destructive/80 hover:text-destructive transition-colors px-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
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
