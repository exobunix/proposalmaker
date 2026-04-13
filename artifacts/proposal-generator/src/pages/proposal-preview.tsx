import { useParams, Link } from "wouter";
import { useGetProposal, getGetProposalQueryKey } from "@workspace/api-client-react";
import { Loader2, ArrowLeft, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ProposalPreview() {
  const params = useParams();
  const id = parseInt(params.id!);

  const { data: proposal, isLoading } = useGetProposal(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProposalQueryKey(id)
    }
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !proposal) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sections = (proposal.sections || {}) as Record<string, string>;
  const enabledSections = (proposal.enabledSections || {}) as Record<string, boolean>;

  const sectionOrder = [
    'executiveSummary', 'aboutCompany', 'projectOverview', 'features', 
    'technologyStack', 'pricing', 'digitalMarketing', 'addOns', 
    'legalTerms', 'acceptanceSection'
  ];

  const sectionTitles: Record<string, string> = {
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

  const activeSections = sectionOrder.filter(key => enabledSections[key] !== false && sections[key]);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Bar - No Print */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background border-b border-border shadow-sm no-print">
        <div className="flex items-center gap-4">
          <Link href={`/proposals/${id}`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <h1 className="text-lg font-serif font-bold leading-none">{proposal.clientName}</h1>
            <p className="text-xs text-muted-foreground mt-1">{proposal.projectName}</p>
          </div>
        </div>
        <Button onClick={handlePrint} className="shadow-sm">
          <Printer className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Document Area */}
      <div className="py-12 no-print flex justify-center">
        <div className="bg-background shadow-xl border border-border w-full max-w-[850px] min-h-[1100px] print:w-full print:border-none print:shadow-none print:m-0 print:max-w-none">
          
          {/* Cover Page */}
          <div className="proposal-page h-[1100px] flex flex-col justify-center px-24 py-20 relative bg-secondary text-secondary-foreground print:h-screen print:w-full">
            <div className="absolute top-20 left-24">
              {proposal.logoUrl ? (
                <img src={proposal.logoUrl} alt="Logo" className="h-16 object-contain" />
              ) : (
                <div className="text-2xl font-serif font-bold tracking-widest uppercase text-primary">COMPANY</div>
              )}
            </div>
            
            <div className="space-y-6 mt-auto mb-auto">
              <div className="w-20 h-1 bg-primary mb-12"></div>
              <h2 className="text-2xl font-mono text-primary uppercase tracking-widest">Proposal For</h2>
              <h1 className="text-6xl font-serif font-bold leading-tight">{proposal.clientName}</h1>
              <p className="text-2xl font-sans font-light text-secondary-foreground/80 pt-4">{proposal.projectName}</p>
            </div>
            
            <div className="absolute bottom-20 left-24 space-y-1">
              <p className="text-sm font-mono text-secondary-foreground/50 uppercase tracking-wider">Date</p>
              <p className="text-base font-sans">{format(new Date(proposal.projectDate || new Date()), 'MMMM d, yyyy')}</p>
            </div>
          </div>

          {/* Table of Contents */}
          {activeSections.length > 0 && (
            <div className="proposal-page px-24 py-20 print:min-h-screen">
              <h2 className="text-4xl font-serif font-bold mb-12 border-b border-border pb-6">Table of Contents</h2>
              <div className="space-y-6 max-w-2xl">
                {activeSections.map((key, index) => (
                  <div key={key} className="flex items-end text-lg font-serif">
                    <span className="font-mono text-primary text-sm w-8">{String(index + 1).padStart(2, '0')}.</span>
                    <span className="font-semibold">{sectionTitles[key] || key}</span>
                    <div className="flex-1 border-b border-dotted border-border mx-4 mb-2"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sections */}
          {activeSections.map((key) => (
            <div key={key} className="proposal-page px-24 py-20 print:min-h-screen">
              <h2 className="text-3xl font-serif font-bold mb-10 text-foreground border-b border-border pb-6 inline-block">
                {sectionTitles[key] || key}
              </h2>
              <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed prose-a:text-primary max-w-none">
                <div dangerouslySetContent={{ __html: sections[key] }} />
              </div>
            </div>
          ))}

          {/* Acceptance Section - specialized rendering */}
          {proposal.contactDetails && (
            <div className="proposal-page px-24 py-20 print:min-h-screen flex flex-col justify-end">
              <div className="border-t border-border pt-12 mt-20 grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-lg font-serif font-bold mb-4">Client Acceptance</h4>
                  <div className="h-20 border-b border-border mb-2 flex items-end">
                    {proposal.signatureUrl && (
                      <img src={proposal.signatureUrl} alt="Signature" className="h-16 object-contain" />
                    )}
                  </div>
                  <p className="text-sm font-mono text-muted-foreground uppercase">Signature / Date</p>
                  <p className="font-serif mt-4">{proposal.clientName}</p>
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold mb-4">Contact Information</h4>
                  <div className="prose prose-sm dark:prose-invert font-sans whitespace-pre-wrap text-muted-foreground">
                    {proposal.contactDetails}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
