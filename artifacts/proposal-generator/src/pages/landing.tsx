import { useState, useEffect } from "react";
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

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Cursor Spotlight */}
      <div 
        style={{
          position: "fixed",
          top: mousePos.y - 150,
          left: mousePos.x - 150,
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)",
          pointerEvents: "none",
          zIndex: 1,
          transition: "transform 0.15s ease-out"
        }}
      />
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

      <main className="flex-1 w-full flex flex-col items-center">
        <section 
          className="px-6 pt-20 pb-16 text-center max-w-5xl mx-auto flex flex-col items-center space-y-6 z-10 animate-fade-in-up"
        >
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

          {/* Centered Dashboard Mockup Image */}
          <div 
            className="w-full max-w-4xl mt-12 border border-border/60 rounded-2xl overflow-hidden shadow-2xl bg-card/50 backdrop-blur-md p-2 group hover:border-amber-500/30 transition-all duration-500"
          >
            <img 
              src="/proposal_builder_mockup.png" 
              alt="AI Proposal Maker Dashboard Mockup" 
              className="rounded-xl w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]" 
            />
          </div>
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

        {/* ── 1. THE 11-STAGE AI PIPELINE BLUEPRINT ── */}
        <section className="w-full bg-muted/20 border-y border-border/40 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The 11-Stage Intelligent Strategy Pipeline</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our backend runs your inputs through a multi-tier strategy analysis to output consulting-grade results.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Requirement Analysis", desc: "Extracts key project scopes, deliverables, and boundaries." },
              { num: "02", title: "Industry Detection", desc: "Maps the project to one of 11 premium dynamic theme palettes." },
              { num: "03", title: "Competitor Intelligence", desc: "Searches and highlights industry differentiator strategies." },
              { num: "04", title: "Technical Blueprinting", desc: "Constructs modular database models, user flows, and API endpoints." }
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 relative">
                <span className="text-4xl font-black text-amber-500/20 absolute top-4 right-4">{s.num}</span>
                <h3 className="font-bold text-base mb-2 mt-4">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. PREMIUM INDUSTRY STYLES SHOWCASE ── */}
        <section className="w-full py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">11 Sector-Specific Premium Themes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every proposal is mapped to a dynamic, bespoke design palette with custom motifs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Fintech", color: "bg-emerald-600", desc: "Clean financial meshes" },
              { name: "Healthcare", color: "bg-cyan-600", desc: "Medical vector layouts" },
              { name: "Technology", color: "bg-indigo-600", desc: "Modern abstract meshes" },
              { name: "Real Estate", color: "bg-amber-600", desc: "Warm corporate solids" },
              { name: "Construction", color: "bg-yellow-600", desc: "Industrial grid lattices" },
              { name: "Agriculture", color: "bg-green-700", desc: "Organic fluid motifs" },
              { name: "Restaurant", color: "bg-rose-600", desc: "Bold warm interfaces" },
              { name: "IoT & Smart Cities", color: "bg-blue-600", desc: "Tech grid networks" }
            ].map((t, i) => (
              <div key={i} className="border border-border/50 bg-card/50 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${t.color} shrink-0`} />
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. INTERACTIVE ROI SAVINGS CALCULATOR ── */}
        <section className="w-full bg-gradient-to-br from-amber-500/5 to-transparent border-y border-border/40 py-20 px-6">
          <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Estimate Your Savings</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                How much time and money does Proposa AI save you? Enter your metrics to see the impact.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold block">Proposals written per month</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    defaultValue="5" 
                    id="propRange" 
                    className="w-full accent-amber-500" 
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      const outputCount = document.getElementById("outputCount");
                      const outputHours = document.getElementById("outputHours");
                      const outputDollars = document.getElementById("outputDollars");
                      if (outputCount) outputCount.innerText = String(count);
                      if (outputHours) outputHours.innerText = String(count * 6);
                      if (outputDollars) outputDollars.innerText = String(count * 6 * 75);
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 Proposal</span>
                    <span className="font-bold text-foreground"><span id="outputCount">5</span> Proposals</span>
                    <span>30 Proposals</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  * Assumes an average manual writing time of 6 hours per proposal at a professional rate of $75/hour.
                </p>
              </div>
              <div className="bg-muted/40 border border-border/40 rounded-2xl p-6 text-center space-y-4">
                <div>
                  <div className="text-sm font-mono text-muted-foreground uppercase">Hours Saved / Month</div>
                  <div className="text-4xl font-black text-amber-600 mt-1"><span id="outputHours">30</span> Hours</div>
                </div>
                <div>
                  <div className="text-sm font-mono text-muted-foreground uppercase">Value Reclaimed</div>
                  <div className="text-4xl font-black text-amber-600 mt-1">$<span id="outputDollars">2250</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. ENTERPRISE LAYOUT BLOCKS & DIAGRAMS ── */}
        <section className="w-full py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Deloitte-Grade Layouts & Diagrams</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Never present plain paragraphs. Our engine automatically outputs premium layouts and vector graphics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="h-24 bg-muted/30 rounded-xl flex items-center justify-center text-3xl">📊</div>
              <h3 className="font-bold text-lg">Integrated Recharts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Renders interactive ROI estimation bars, milestone Gantts, package values, and risk heatmaps.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="h-24 bg-muted/30 rounded-xl flex items-center justify-center text-3xl">🔄</div>
              <h3 className="font-bold text-lg">Auto-Vector Diagrams</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Outputs flowcharts detailing user registration authentication, data submits, and API pipelines.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="h-24 bg-muted/30 rounded-xl flex items-center justify-center text-3xl">⚡</div>
              <h3 className="font-bold text-lg">Premium Visual Cards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wraps objectives, features, and methodologies in stylized Callouts, Stats cards, and Info grids.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. SECURITY & CONFIDENTIALITY COMPLIANCE ── */}
        <section className="w-full bg-muted/20 border-y border-border/40 py-20 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Security & Compliance Safeguards</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your company IP and customer requirements are strictly protected. We adhere to robust cloud isolation protocols to guarantee confidentiality:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                  <span>AES-256 data encryption at rest and TLS 1.3 in transit.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                  <span>Strict zero-data-retention policy for corporate LLM interfaces.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                  <span>Role-based authorization gates securing PDF download signatures.</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-6">
              <h3 className="font-bold text-lg">Confidentiality Guarantee</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We guarantee that your proposal text, pricing figures, and client lists will never be used for training public models. Every instance is sandbox-isolated.
              </p>
              <div className="border-t border-border pt-6 flex items-center gap-4">
                <div className="text-center shrink-0">
                  <div className="text-xl font-bold">100%</div>
                  <div className="text-[10px] text-muted-foreground">Private</div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-xl font-bold">256-Bit</div>
                  <div className="text-[10px] text-muted-foreground">Encrypted</div>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-xl font-bold">SOC-2</div>
                  <div className="text-[10px] text-muted-foreground">Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. DETAILED PRICING PLANS ── */}
        <section className="w-full py-20 px-6">
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

        {/* ── 7. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
        <section className="w-full bg-muted/10 border-t border-border/40 py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-sm">
                Everything you need to know about our visual proposal generation platform.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { q: "How does the AI generate structural flowcharts and charts?", a: "Our AI Strategy Pipeline outputs structural JSON data describing node connection indexes. These are mapped in real-time on your frontend into vector SVGs and responsive Recharts widgets, ensuring clear layouts and crisp printing." },
                { q: "Can I download print-ready PDFs?", a: "Yes. Our export system triggers a server-side Puppeteer engine that outputs A4/Letter size documents with perfect page margins, embedded fonts, and clickable Table of Contents." },
                { q: "Is my client details data confidential?", a: "Absolutely. We enforce sandbox isolation and strict zero-retention parameters, ensuring that your inputs, custom details, and compiled statistics are never shared or used to train public LLM models." },
                { q: "Can I customize the authoring company name?", a: "Yes. When editing or creating a proposal, you can fill in the 'Proposal Generated By' field with your name or business, which dynamically overrides the TechVision default values on the cover page and footer." }
              ].map((faq, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                  <h4 className="font-bold text-base mb-2 text-foreground">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground relative z-10 px-6 bg-card">
        <p>© {new Date().getFullYear()} Proposa AI. Premium Client Proposals Made Simple.</p>
      </footer>
    </div>
  );
}
