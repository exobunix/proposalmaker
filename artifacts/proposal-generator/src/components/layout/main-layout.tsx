import { Sidebar } from "./sidebar";
import { useLocation } from "wouter";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isPreviewFullscreen = location.endsWith("/preview");

  if (isPreviewFullscreen) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {children}
      </main>
    </div>
  );
}
