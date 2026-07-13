import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, CheckCircle2, ChevronRight, Zap, Target, Star, Shield } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      setLocation("/");
    } else {
      setLocation("/register");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl -z-10 dark:bg-amber-950/10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl -z-10 dark:bg-amber-950/5" />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-amber-600 bg-clip-text text-transparent">
            Proposa AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={() => setLocation("/")} className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-lg shadow-amber-500/10">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-md shadow-amber-500/10 hover:shadow-amber-500/20">
                Get Started Free
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto flex flex-col items-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="h-3.5 w-3.5" /> Generates proposals in minutes
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] md:leading-[1.05]">
            Create Winning Client Proposals{" "}
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              For Free
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            Generate customized, investor-grade proposals for custom software, digital marketing, web apps, and design projects using state-of-the-art AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleGetStarted} size="lg" className="h-12 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all text-base group">
              Start Generating Free
              <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card required • Generate up to 3 proposals for free
          </p>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center tracking-tight mb-12">Everything you need to close deals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/40 border border-border/40 p-6 rounded-2xl shadow-sm backdrop-blur-sm relative group hover:border-amber-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tailored Sections</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automatically generate Executive Summary, Tech Stack, Pricing Tiers, Digital Marketing details, and Legal terms tailored to your client.
              </p>
            </div>
            
            <div className="bg-card/40 border border-border/40 p-6 rounded-2xl shadow-sm backdrop-blur-sm relative group hover:border-amber-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Export to PDF</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Export beautifully formatted, print-ready proposals complete with your company logo, contact details, and client sign-off sections.
              </p>
            </div>

            <div className="bg-card/40 border border-border/40 p-6 rounded-2xl shadow-sm backdrop-blur-sm relative group hover:border-amber-500/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Rewriter</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Adjust section tones on-the-fly. Switch between Professional, Startup-Friendly, or Premium Luxury writing styles with a single click.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing/Subscription Section */}
        <section className="w-full bg-muted/30 border-y border-border/40 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Simple, Transparent Plans</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start for free, generate proposals, and scale as your client base grows.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Free Plan */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative group hover:border-border transition-all">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Free Tier</h3>
                  <p className="text-muted-foreground text-sm mb-6">Perfect for trying out our AI generation</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-muted-foreground text-sm font-semibold">/forever</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Create up to 3 proposals</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Full access to AI generator</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Export to PDF/Signatures</span>
                    </li>
                  </ul>
                </div>
                <Button onClick={handleGetStarted} className="mt-8 w-full border border-border bg-transparent text-foreground hover:bg-muted font-semibold h-11 transition-all">
                  Get Started Free
                </Button>
              </div>

              {/* Starter Plan (Popular) */}
              <div className="bg-card border-2 border-amber-500 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20">
                  <Star className="h-3 w-3 fill-current" /> Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Starter Plan</h3>
                  <p className="text-muted-foreground text-sm mb-6">For freelancers and small agencies</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">$19</span>
                    <span className="text-muted-foreground text-sm font-semibold">/month</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-amber-600">Up to 15 proposals / mo</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Premium PDF Styles</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Remove Watermarks</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Priority AI Speed</span>
                    </li>
                  </ul>
                </div>
                <Button onClick={handleGetStarted} className="mt-8 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold h-11 transition-all shadow-md shadow-amber-500/20">
                  Upgrade Now
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative group hover:border-border transition-all">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Professional Plan</h3>
                  <p className="text-muted-foreground text-sm mb-6">For busy firms closing daily deals</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">$49</span>
                    <span className="text-muted-foreground text-sm font-semibold">/month</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-amber-600">Unlimited Proposals</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Custom Design Templates</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>Dedicated API Integrations</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>24/7 Priority Support</span>
                    </li>
                  </ul>
                </div>
                <Button onClick={handleGetStarted} className="mt-8 w-full border border-border bg-transparent text-foreground hover:bg-muted font-semibold h-11 transition-all">
                  Get Professional
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground relative z-10 px-6">
        <p>© {new Date().getFullYear()} Proposa AI. Premium Client Proposals Made Simple.</p>
      </footer>
    </div>
  );
}
