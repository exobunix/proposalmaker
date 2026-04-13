import { useListProposals, useGetProposalStats, useDeleteProposal, useDuplicateProposal, getListProposalsQueryKey, getGetProposalStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { Plus, FileText, MoreVertical, Pencil, Copy, Trash2, CheckCircle2, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isStatsLoading } = useGetProposalStats();
  const { data: proposals, isLoading: isProposalsLoading } = useListProposals();

  const deleteProposal = useDeleteProposal({
    mutation: {
      onSuccess: () => {
        toast({ title: "Proposal deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProposalStatsQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to delete proposal", variant: "destructive" });
      }
    }
  });

  const duplicateProposal = useDuplicateProposal({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Proposal duplicated successfully" });
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProposalStatsQueryKey() });
        setLocation(`/proposals/${data.id}`);
      },
      onError: () => {
        toast({ title: "Failed to duplicate proposal", variant: "destructive" });
      }
    }
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      deleteProposal.mutate({ id });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case 'sent': return <Send className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case 'sent': return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default: return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Proposals</h1>
          <p className="text-muted-foreground mt-1">Manage and track your investor-grade proposals.</p>
        </div>
        <Link href="/proposals/new">
          <Button size="lg" className="font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isStatsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="shadow-sm border-border">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                <p className="text-3xl font-serif font-bold">{stats?.total || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Drafts</p>
                <p className="text-3xl font-serif font-bold">{stats?.draft || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Sent</p>
                <p className="text-3xl font-serif font-bold">{stats?.sent || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Approved</p>
                <p className="text-3xl font-serif font-bold">{stats?.approved || 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-serif font-semibold">Recent Proposals</h2>
        {isProposalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="h-48 border-border">
                <CardHeader>
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !proposals?.length ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No proposals yet</h3>
            <p className="text-muted-foreground mb-4">Create your first proposal to get started.</p>
            <Link href="/proposals/new">
              <Button variant="outline">Create Proposal</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="group hover:shadow-md transition-all duration-200 border-border bg-card flex flex-col">
                <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="font-serif text-lg leading-tight line-clamp-1">{proposal.clientName}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">{proposal.projectName}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLocation(`/proposals/${proposal.id}`)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateProposal.mutate({ id: proposal.id })}>
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation(`/proposals/${proposal.id}/preview`)}>
                        <FileText className="w-4 h-4 mr-2" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(proposal.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{proposal.projectType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">{proposal.clientIndustry}</span>
                    </div>
                    {proposal.budgetRange && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">{proposal.budgetRange}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border flex justify-between items-center">
                  <Badge variant="outline" className={`capitalize font-mono text-[10px] ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(new Date(proposal.updatedAt), 'MMM d, yyyy')}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
