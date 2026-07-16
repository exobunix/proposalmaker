import { useParams, Link } from "wouter";
import { 
  useGetProposal, 
  getGetProposalQueryKey, 
  useUpdateProposal,
  useGenerateProposalContent,
  useRewriteContent,
  getListProposalsQueryKey,
  Proposal
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles, FileText, CheckCircle2, ArrowLeft, RefreshCw, Sliders, Edit3, Eye, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { ProposalSectionRenderer } from "@/pages/proposal-preview";

// Import visual blocks directly
import { ArchitectureDiagram, TimelineVisual, TechStackVisual } from "@/components/proposal/proposal-preview-panel";

export default function ProposalWorkspace() {
  const params = useParams();
  const isNew = !params.id || params.id === "new";
  const id = isNew ? null : parseInt(params.id!);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTheme, setSelectedTheme] = useState<string>("indigo");
  const [activeSectionKey, setActiveSectionKey] = useState<string>("executiveSummary");
  const [detailLevel, setDetailLevel] = useState<number>(85);
  const [selectedTone, setSelectedTone] = useState<string>("premium");
  const [showMetadataModal, setShowMetadataModal] = useState<boolean>(false);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`proposal_theme_${id || 'new'}`);
    if (saved) {
      setSelectedTheme(saved);
    }
  }, [id]);

  const { data: proposal, isLoading } = useGetProposal(id || 0, {
    query: {
      enabled: !isNew && !!id,
      queryKey: getGetProposalQueryKey(id || 0)
    }
  });

  const generateContent = useGenerateProposalContent({
    mutation: {
      onSuccess: (data) => {
        if (!proposal) return;
        const currentSections = { ...(proposal.sections || {}) };
        currentSections[generatingSection!] = data.content;
        
        updateProposal.mutate({
          id: proposal.id,
          data: { sections: currentSections as any }
        }, {
          onSuccess: () => {
            setGeneratingSection(null);
            toast({ title: "Slide generated successfully!" });
          }
        });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Generation failed", variant: "destructive" });
      }
    }
  });

  const rewriteContent = useRewriteContent({
    mutation: {
      onSuccess: (data) => {
        if (!proposal) return;
        const currentSections = { ...(proposal.sections || {}) };
        currentSections[generatingSection!] = data.content;

        updateProposal.mutate({
          id: proposal.id,
          data: { sections: currentSections as any }
        }, {
          onSuccess: () => {
            setGeneratingSection(null);
            toast({ title: "Tone rewritten successfully" });
          }
        });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Failed to rewrite slide content", variant: "destructive" });
      }
    }
  });

  const updateProposal = useUpdateProposal({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProposalQueryKey(id || 0) });
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() });
      }
    }
  });

  if (!isNew && isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#090b0e] text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const sections = (proposal?.sections || {}) as Record<string, any>;
  const enabledSections = (proposal?.enabledSections || {}) as Record<string, boolean>;

  const sectionOrder = [
    "executiveSummary", "proposedSolution", "systemOverview", "features", "technologyStack", 
    "costEstimation", "timeline", "riskAnalysis", "signaturePage"
  ];

  const sectionTitles: Record<string, string> = {
    executiveSummary: "Executive Summary",
    proposedSolution: "Proposed Solution Overview",
    systemOverview: "Architecture Blueprint",
    features: "Key System Features",
    technologyStack: "Custom Tech Stack",
    costEstimation: "Package Pricing & ROI",
    timeline: "Milestones & Gantt",
    riskAnalysis: "Risk Mitigation Model",
    signaturePage: "Client Acceptance & Deal Signoff"
  };

  const handleGenerate = (key: string) => {
    if (!proposal) return;
    setGeneratingSection(key);
    generateContent.mutate({
      data: {
        section: key,
        clientName: proposal.clientName,
        projectName: proposal.projectName,
        clientIndustry: proposal.clientIndustry,
        projectType: proposal.projectType,
        budgetRange: proposal.budgetRange,
        additionalContext: proposal.additionalContext,
        contactDetails: proposal.contactDetails
      }
    });
  };

  const handleToneRewrite = (key: string) => {
    if (!proposal || !sections[key]) return;
    setGeneratingSection(key);
    
    const rawContent = typeof sections[key] === "object" ? JSON.stringify(sections[key]) : sections[key];

    rewriteContent.mutate({
      data: {
        section: key,
        content: rawContent,
        tone: selectedTone
      }
    });
  };

  const isGenerating = generatingSection === activeSectionKey;
  const currentSlideIndex = sectionOrder.indexOf(activeSectionKey) + 1;
  const activeContent = sections[activeSectionKey];

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0b0d] text-slate-100 flex flex-col font-sans">
      
      {/* ── TOP HEADER (SYNAPSE STYLE) ── */}
      <header className="h-16 border-b border-[#1b1e24] bg-[#0c0e12] px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            <ArrowLeft className="w-5 h-5 cursor-pointer text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-mono font-bold tracking-widest text-amber-500 text-xs">SYNAPSE AI</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <span className="text-sm font-semibold text-slate-300">
            Active Proposal: <span className="text-white">{proposal?.projectName || "Quantum Dynamics Strategy"}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {proposal && (
            <>
              {/* Metadata Edit Modal Dialog */}
              <Dialog open={showMetadataModal} onOpenChange={setShowMetadataModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 hover:text-amber-400 h-9 font-medium text-xs">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Details Form
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl bg-[#0c0e12] border-[#1e232b] text-slate-200">
                  <DialogHeader>
                    <DialogTitle className="text-white">Edit Proposal Details</DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                      Update metadata, client specifications, contact details or industry styling tags.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh] pr-4">
                    <ProposalForm 
                      proposal={proposal} 
                      isNew={false} 
                      selectedTheme={selectedTheme} 
                      onThemeChange={(t) => setSelectedTheme(t)} 
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Link href={`/proposals/${proposal.id}/preview`} target="_blank">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-md shadow-amber-500/10 h-9 text-xs">
                  <Eye className="w-4 h-4 mr-1.5" />
                  Live Preview
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── THREE COLUMN CONTENT AREA ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: PROPOSAL OUTLINE & CONTENT */}
        <div className="w-64 border-r border-[#15181e] bg-[#0c0e12]/80 flex flex-col p-4">
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-4">
            Proposal Outline & Content
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1.5 pr-2">
              {sectionOrder.map((key) => {
                const isGenerated = !!sections[key];
                const isActive = key === activeSectionKey;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSectionKey(key)}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all border text-xs group ${
                      isActive 
                        ? "bg-[#1b1e24] border-amber-500/40 text-white font-medium" 
                        : "bg-transparent border-transparent text-slate-400 hover:bg-[#12151a] hover:text-white"
                    }`}
                  >
                    <span className="truncate">{sectionTitles[key]}</span>
                    {isGenerated ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* COLUMN 2: WORKSPACE PRESENTATION SLIDE PREVIEW */}
        <div className="flex-1 flex flex-col bg-[#07080a] p-8 overflow-y-auto">
          <div className="max-w-[760px] mx-auto w-full flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  Slide {currentSlideIndex}: {sectionTitles[activeSectionKey]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">16:9 Presentation Format</span>
              </div>

              {/* PRESENTATION SLIDE FRAME */}
              <div className="aspect-[1.6] w-full rounded-2xl border border-[#1b1e24] bg-[#0d0f12] shadow-2xl relative overflow-hidden flex flex-col justify-between p-10 group/slide">
                
                {/* Tech Lattice Watermark Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="slideGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#slideGrid)" />
                  </svg>
                </div>

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs">
                      ⚡
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                      {proposal?.clientName || "CLIENT DEFI"} • {sectionTitles[activeSectionKey]}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-500/80 tracking-widest uppercase">SYNAPSE AI</span>
                </div>

                {/* Core slide body content */}
                <div className="flex-1 flex flex-col justify-center my-6 z-10">
                  {isGenerating ? (
                    <div className="space-y-4 py-8 text-center flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                      <p className="text-xs text-slate-400 italic">Synthesizing strategy parameters & visual diagrams...</p>
                    </div>
                  ) : activeContent ? (
                    <ScrollArea className="max-h-[220px] pr-2">
                      <div className="text-slate-300 text-xs leading-relaxed space-y-4">
                        <ProposalSectionRenderer sectionData={activeContent} />
                        
                        {/* Render inline mockup visuals matching slide requirements */}
                        {typeof activeContent === "string" && activeSectionKey === "systemOverview" && (
                          <div className="scale-90 origin-top mt-2">
                            <ArchitectureDiagram markdown={activeContent} />
                            <TimelineVisual markdown={activeContent} />
                          </div>
                        )}
                        {typeof activeContent === "string" && activeSectionKey === "technologyStack" && (
                          <div className="scale-90 origin-top mt-2">
                            <TechStackVisual markdown={activeContent} />
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-10 flex flex-col items-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 text-sm">🗂️</div>
                      <p className="text-xs text-slate-400 max-w-xs leading-normal">
                        This slide is empty. Generate premium consulting-grade analysis parameters now.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => handleGenerate(activeSectionKey)} 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs h-8 px-4"
                      >
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono border-t border-slate-900 pt-3 z-10">
                  <span>© {proposal?.contactDetails || "Synapse Solutions"} — Confidential</span>
                  <span>Slide {currentSlideIndex} of {sectionOrder.length}</span>
                </div>
              </div>
            </div>

            {/* BOTTOM LIVE PREVIEW THUMBNAILS STRIP */}
            <div className="mt-8">
              <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-3">
                Live Preview Strip
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 pr-4">
                {sectionOrder.map((key, idx) => {
                  const isActive = key === activeSectionKey;
                  const isGen = !!sections[key];
                  return (
                    <div 
                      key={key}
                      onClick={() => setActiveSectionKey(key)}
                      className={`min-w-[100px] aspect-[1.6] rounded-lg border cursor-pointer relative overflow-hidden flex flex-col justify-between p-2 shrink-0 select-none transition-all ${
                        isActive 
                          ? "border-amber-500 bg-[#12151b] shadow-lg scale-102" 
                          : "border-[#1c212a] bg-[#0c0e12] hover:border-slate-700"
                      }`}
                    >
                      <span className="text-[7px] text-slate-500 font-mono block truncate">
                        Slide {idx + 1}
                      </span>
                      <div className="h-4 flex items-center justify-center">
                        {isGen ? (
                          <div className="text-[8px] text-amber-500">✓ Active</div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <span className="text-[6px] text-slate-400 font-medium block truncate text-center">
                        {sectionTitles[key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* COLUMN 3: AI ACTIONS / RECOMMENDATIONS PANEL */}
        <div className="w-80 border-l border-[#15181e] bg-[#0c0e12]/80 flex flex-col p-5 justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1e24]">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                AI Recommendations
              </span>
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Description advice info box */}
            <div className="bg-[#1b1e24] border border-[#d4af37]/20 rounded-xl p-4 space-y-2">
              <div className="text-[9px] text-amber-500 uppercase tracking-wider font-semibold">Current Slide Context</div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Optimize slide content for {proposal?.clientName || "the target client"}'s {proposal?.clientIndustry || "domain"} sector requirements.
              </p>
            </div>

            {/* Detail Level Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Detail Level</span>
                <span className="font-mono text-amber-500 font-bold">{detailLevel}%</span>
              </div>
              <Slider 
                min={50} 
                max={100} 
                step={5} 
                value={[detailLevel]} 
                onValueChange={(val) => setDetailLevel(val[0])}
                className="accent-amber-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Summary</span>
                <span>Deep Analysis</span>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs text-slate-400 font-medium block">Writing Tone Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "premium", label: "Premium" },
                  { value: "professional", label: "Formal" },
                  { value: "startup", label: "Startup" }
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTone(t.value)}
                    className={`py-2 px-1 rounded-lg border text-[10px] font-semibold transition-all ${
                      selectedTone === t.value 
                        ? "border-amber-500 bg-amber-500/10 text-white" 
                        : "border-slate-800 bg-transparent text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#1b1e24]">
            <Button
              disabled={isGenerating || !activeContent}
              onClick={() => handleToneRewrite(activeSectionKey)}
              className="w-full bg-[#1b1e24] hover:bg-[#252a33] text-white border border-[#3b4252] text-xs h-10 font-medium"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
              Regenerate Analysis
            </Button>

            <Button
              disabled={isGenerating}
              onClick={() => handleGenerate(activeSectionKey)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs h-10 shadow-md"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
              Reconstruct Slide
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
