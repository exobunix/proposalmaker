import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useUpdateProposal,
  useGenerateProposalContent,
  useRewriteContent,
  getGetProposalQueryKey,
  Proposal
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Wand2, Maximize2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { markdownToHtml } from "@/lib/markdown";

interface ProposalPreviewPanelProps {
  proposal?: Proposal;
}

const SECTION_KEYS = [
  'executiveSummary', 'aboutCompany', 'projectOverview', 'features', 
  'technologyStack', 'pricing', 'digitalMarketing', 'addOns', 
  'legalTerms', 'acceptanceSection'
];

const SECTION_TITLES: Record<string, string> = {
  executiveSummary: "Executive Summary",
  aboutCompany: "About Us",
  projectOverview: "Project Overview",
  features: "Key Features",
  technologyStack: "Technology Stack",
  pricing: "Investment",
  digitalMarketing: "Digital Marketing",
  addOns: "Optional Add-ons",
  legalTerms: "Terms & Conditions",
  acceptanceSection: "Acceptance"
};

export function ProposalPreviewPanel({ proposal }: ProposalPreviewPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  const updateProposal = useUpdateProposal({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetProposalQueryKey(data.id), data);
      },
      onError: () => {
        toast({ title: "Failed to update section visibility", variant: "destructive" });
      }
    }
  });

  const generateContent = useGenerateProposalContent({
    mutation: {
      onSuccess: (data, variables) => {
        if (proposal) {
          const sections = { ...(proposal.sections as Record<string, string>) || {} };
          sections[variables.data.section] = data.content;
          
          updateProposal.mutate({
            id: proposal.id,
            data: { sections: sections as any }
          });
        }
        setGeneratingSection(null);
        toast({ title: "Section generated successfully" });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Failed to generate section", variant: "destructive" });
      }
    }
  });

  const rewriteContent = useRewriteContent({
    mutation: {
      onSuccess: (data, variables) => {
        if (proposal) {
          const sections = { ...(proposal.sections as Record<string, string>) || {} };
          sections[variables.data.section] = data.content;
          
          updateProposal.mutate({
            id: proposal.id,
            data: { sections: sections as any }
          });
        }
        setGeneratingSection(null);
        toast({ title: "Section rewritten successfully" });
      },
      onError: () => {
        setGeneratingSection(null);
        toast({ title: "Failed to rewrite section", variant: "destructive" });
      }
    }
  });

  if (!proposal) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-card/30">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Wand2 className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-serif font-medium text-foreground mb-2">Live Preview</h3>
        <p className="max-w-sm">Fill out the proposal details and click "Generate with AI" to see the full document here.</p>
      </div>
    );
  }

  const sections = (proposal.sections || {}) as Record<string, string>;
  const enabledSections = (proposal.enabledSections || {}) as Record<string, boolean>;

  const toggleSection = (key: string, enabled: boolean) => {
    const updatedEnabled = { ...enabledSections, [key]: enabled };
    updateProposal.mutate({
      id: proposal.id,
      data: { enabledSections: updatedEnabled as any }
    });
  };

  const handleGenerateSection = (key: string) => {
    setGeneratingSection(key);
    generateContent.mutate({
      data: {
        section: key,
        clientName: proposal.clientName,
        projectName: proposal.projectName,
        clientIndustry: proposal.clientIndustry,
        projectType: proposal.projectType,
        budgetRange: proposal.budgetRange
      }
    });
  };

  const handleRewrite = (key: string, tone: string) => {
    const content = sections[key];
    if (!content) return;

    setGeneratingSection(key);
    rewriteContent.mutate({
      data: {
        section: key,
        content,
        tone
      }
    });
  };

  const isAnySectionGenerated = Object.values(sections).some(s => !!s);

  if (!isAnySectionGenerated) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card/30">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Wand2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Ready to Generate</h3>
        <p className="max-w-md text-muted-foreground mb-8">
          The details are set. Click the "Generate with AI" button on the left to instantly build a complete, investor-grade proposal.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-serif font-semibold">Live Preview</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest font-bold">
            {proposal.status}
          </span>
        </div>
        <Link href={`/proposals/${proposal.id}/preview`}>
          <Button variant="default" size="sm" className="shadow-sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Full Screen PDF
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1 p-6 lg:p-10">
        <div className="max-w-[800px] mx-auto space-y-8 pb-20">
          
          <div className="bg-card rounded-lg border border-border p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="space-y-4">
              <h2 className="text-sm font-mono text-primary uppercase tracking-widest">Proposal For</h2>
              <h1 className="text-4xl font-serif font-bold leading-tight text-foreground">{proposal.clientName}</h1>
              <p className="text-xl font-sans text-muted-foreground">{proposal.projectName}</p>
            </div>
          </div>

          {SECTION_KEYS.map((key) => {
            const isEnabled = enabledSections[key] !== false; // true by default if undefined
            const content = sections[key];
            const isGenerating = generatingSection === key;

            return (
              <div 
                key={key} 
                className={`bg-card rounded-lg border transition-all duration-300 ${
                  isEnabled ? "border-border shadow-sm" : "border-border/50 opacity-60 grayscale-[0.3]"
                }`}
              >
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/10 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={isEnabled} 
                      onCheckedChange={(checked) => toggleSection(key, checked)}
                    />
                    <h3 className="font-serif font-semibold text-lg">{SECTION_TITLES[key]}</h3>
                  </div>
                  
                  {isEnabled && (
                    <div className="flex items-center gap-2">
                      {content ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isGenerating} className="h-8 text-xs font-medium">
                              {isGenerating ? (
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-2" />
                              )}
                              AI Rewrite
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleRewrite(key, "professional")}>
                              Professional tone
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRewrite(key, "premium")}>
                              Premium/Luxury tone
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRewrite(key, "startup")}>
                              Startup/Modern tone
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleGenerateSection(key)}
                          disabled={isGenerating}
                          className="h-8 text-xs font-medium"
                        >
                          {isGenerating ? (
                            <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Generating...</>
                          ) : (
                            <><Wand2 className="w-3 h-3 mr-2" /> Generate</>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {isEnabled && (
                  <div className="p-6 lg:p-8">
                    {isGenerating ? (
                      <div className="space-y-4 py-4">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                      </div>
                    ) : content ? (
                      <div
                        className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed max-w-none"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                      />
                    ) : (
                      <div className="text-center py-8 text-muted-foreground italic font-serif">
                        Section content empty. Click Generate to create.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
