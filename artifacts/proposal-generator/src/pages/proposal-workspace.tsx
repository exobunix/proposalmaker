import { useParams } from "wouter";
import { useGetProposal, getGetProposalQueryKey } from "@workspace/api-client-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { ProposalPreviewPanel } from "@/components/proposal/proposal-preview-panel";
import { Loader2 } from "lucide-react";

export default function ProposalWorkspace() {
  const params = useParams();
  const isNew = !params.id || params.id === "new";
  const id = isNew ? null : parseInt(params.id!);

  const { data: proposal, isLoading } = useGetProposal(id!, {
    query: {
      enabled: !!id,
      queryKey: getGetProposalQueryKey(id!)
    }
  });

  if (!isNew && isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={30} className="border-r border-border bg-sidebar/30">
          <ProposalForm proposal={proposal} isNew={isNew} />
        </ResizablePanel>
        <ResizableHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors" />
        <ResizablePanel defaultSize={60} minSize={30} className="bg-muted/10 relative overflow-hidden">
          <ProposalPreviewPanel proposal={proposal} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
