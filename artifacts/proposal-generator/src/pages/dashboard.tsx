import { useState } from "react";
import { useListProposals, useGetProposalStats, useDeleteProposal, useDuplicateProposal, getListProposalsQueryKey, getGetProposalStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { Plus, FileText, MoreVertical, Pencil, Copy, Trash2, CheckCircle2, Clock, Send, Sparkles, Check, AlertTriangle } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useGetProposalStats();
  const { data: proposals, isLoading: isProposalsLoading } = useListProposals();

  const isLimitReached = user?.subscription === "free" && (stats?.total ?? 0) >= 3;

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
      onError: (err: any) => {
        if (err.status === 403) {
          setShowUpgradeModal(true);
        } else {
          toast({ title: "Failed to duplicate proposal", variant: "destructive" });
        }
      }
    }
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      deleteProposal.mutate({ id });
    }
  };

  const handleNewProposalClick = (e: React.MouseEvent) => {
    if (isLimitReached) {
      e.preventDefault();
      setShowUpgradeModal(true);
    }
  };

  const handleDuplicate = (id: number) => {
    if (isLimitReached) {
      setShowUpgradeModal(true);
    } else {
      duplicateProposal.mutate({ id });
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
      
      {/* Upgrade Banner for Free Users */}
      {isLimitReached && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">You've reached your free proposal limit</h3>
              <p className="text-muted-foreground text-sm mt-0.5">Upgrade your subscription plan to create unlimited, professional client proposals.</p>
            </div>
          </div>
          <Button onClick={() => setShowUpgradeModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md shadow-amber-500/10">
            View Upgrade Plans
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Proposals</h1>
          <p className="text-muted-foreground mt-1">Manage and track your investor-grade proposals.</p>
        </div>
        <Link href={isLimitReached ? "#" : "/proposals/new"} onClick={handleNewProposalClick}>
          <Button size="lg" className="font-medium shadow-md hover:shadow-lg transition-all bg-amber-500 hover:bg-amber-600 text-white">
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
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold">{stats?.total || 0}</p>
                  {user?.subscription === "free" && (
                    <span className="text-xs font-semibold text-muted-foreground">3 free limit</span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Drafts</p>
                <p className="text-3xl font-bold">{stats?.draft || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Sent</p>
                <p className="text-3xl font-bold">{stats?.sent || 0}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Approved</p>
                <p className="text-3xl font-bold">{stats?.approved || 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Proposals</h2>
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No proposals yet</h3>
            <p className="text-muted-foreground mb-4">Create your first proposal to get started.</p>
            <Link href={isLimitReached ? "#" : "/proposals/new"} onClick={handleNewProposalClick}>
              <Button variant="outline" className="border-amber-500/30 hover:bg-amber-500/5 text-amber-600">Create Proposal</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="group hover:shadow-md transition-all duration-200 border-border bg-card flex flex-col">
                <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight line-clamp-1">{proposal.clientName}</CardTitle>
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
                      <DropdownMenuItem onClick={() => handleDuplicate(proposal.id)}>
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

      {/* Upgrade Subscription Dialog */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-4xl border-border bg-card shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-amber-600 bg-clip-text text-transparent">
              Upgrade Your Account
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              You have successfully created {stats?.total || 3} of 3 free proposals. Choose a plan to unlock unlimited professional generation.
            </DialogDescription>
          </DialogHeader>

          {/* Plan Selector Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            {/* Free Tier */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col justify-between opacity-75">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Free Tier</h3>
                <p className="text-muted-foreground text-xs mb-4">You have already reached this limit</p>
                <div className="text-3xl font-extrabold mb-6">$0</div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Create up to 3 proposals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Full access to AI generator</span>
                  </li>
                </ul>
              </div>
              <Button disabled className="mt-6 w-full border border-border bg-transparent text-muted-foreground font-semibold h-10">
                Current Plan
              </Button>
            </div>

            {/* Starter Plan */}
            <div className="bg-card border-2 border-amber-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Starter Plan</h3>
                <p className="text-muted-foreground text-xs mb-4">For active freelancers</p>
                <div className="text-3xl font-extrabold mb-6">$19 <span className="text-xs text-muted-foreground font-normal">/month</span></div>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="font-medium">Up to 15 proposals / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Premium PDF styles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Remove all watermarks</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => {
                toast({ title: "Checkout Simulation", description: "Starter Plan upgrade simulated successfully!" });
                setShowUpgradeModal(false);
              }} className="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold h-10 shadow-sm shadow-amber-500/10">
                Upgrade Now
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Professional</h3>
                <p className="text-muted-foreground text-xs mb-4">For scaling agencies</p>
                <div className="text-3xl font-extrabold mb-6">$49 <span className="text-xs text-muted-foreground font-normal">/month</span></div>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-amber-600">Unlimited proposals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Custom Design templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>24/7 Priority support</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => {
                toast({ title: "Checkout Simulation", description: "Professional Plan upgrade simulated successfully!" });
                setShowUpgradeModal(false);
              }} className="mt-6 w-full border border-border bg-transparent text-foreground hover:bg-muted font-semibold h-10">
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
