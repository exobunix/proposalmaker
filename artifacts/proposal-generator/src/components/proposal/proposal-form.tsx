import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { 
  useCreateProposal, 
  useUpdateProposal, 
  useGenerateFullProposal,
  getGetProposalQueryKey,
  getListProposalsQueryKey,
  Proposal
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  projectName: z.string().min(1, "Project Name is required"),
  projectDate: z.date({
    required_error: "A date is required.",
  }),
  clientIndustry: z.string().min(1, "Industry is required"),
  projectType: z.string().min(1, "Project type is required"),
  budgetRange: z.string().optional(),
  contactDetails: z.string().optional(),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  additionalContext: z.string().optional(),
});

interface ProposalFormProps {
  proposal?: Proposal;
  isNew: boolean;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Retail", "Education", 
  "Real Estate", "Manufacturing", "Other"
];

const PROJECT_TYPES = [
  "Web Application", "Mobile App", "SaaS Platform", "Marketplace", 
  "E-Commerce", "Enterprise Software", "Custom Solution"
];

const THEMES = [
  { value: "indigo", label: "Tech Indigo (Default)", colorClass: "bg-indigo-600" },
  { value: "emerald", label: "Emerald Mint", colorClass: "bg-emerald-600" },
  { value: "sunset", label: "Sunset Gold", colorClass: "bg-amber-500" },
  { value: "rose", label: "Rose Gold", colorClass: "bg-rose-500" },
  { value: "navy", label: "Corporate Navy", colorClass: "bg-blue-800" },
  { value: "obsidian", label: "Obsidian Luxury", colorClass: "bg-slate-900" }
];

export function ProposalForm({ proposal, isNew, selectedTheme, onThemeChange }: ProposalFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      projectName: "",
      projectDate: new Date(),
      clientIndustry: "",
      projectType: "",
      budgetRange: "",
      contactDetails: "",
      logoUrl: "",
      signatureUrl: "",
      additionalContext: "",
    },
  });

  useEffect(() => {
    if (proposal && !initializedRef.current) {
      initializedRef.current = true;
      form.reset({
        clientName: proposal.clientName,
        projectName: proposal.projectName,
        projectDate: proposal.projectDate ? new Date(proposal.projectDate) : new Date(),
        clientIndustry: proposal.clientIndustry,
        projectType: proposal.projectType,
        budgetRange: proposal.budgetRange || "",
        contactDetails: proposal.contactDetails || "",
        logoUrl: proposal.logoUrl || "",
        signatureUrl: proposal.signatureUrl || "",
        additionalContext: proposal.additionalContext || "",
      });
    }
  }, [proposal, form]);

  const createProposal = useCreateProposal({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() });
      },
      onError: (err: any) => {
        const errorMsg = err?.status === 403
          ? "You have reached the limit of 3 free proposals. Please upgrade your subscription from the dashboard."
          : "Failed to create proposal";
        toast({ title: errorMsg, variant: "destructive" });
      }
    }
  });

  const updateProposal = useUpdateProposal({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Proposal saved successfully" });
        queryClient.setQueryData(getGetProposalQueryKey(data.id), data);
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to save proposal", variant: "destructive" });
      }
    }
  });

  const generateFullProposal = useGenerateFullProposal({
    mutation: {
      onSuccess: () => {},
      onError: () => {
        toast({ title: "Failed to generate AI content. Please check your API key on Render.", variant: "destructive" });
      }
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedData = {
      ...values,
      projectDate: values.projectDate.toISOString(),
    };

    if (isNew) {
      createProposal.mutate({ data: formattedData });
    } else if (proposal) {
      updateProposal.mutate({ id: proposal.id, data: formattedData });
    }
  }

  const handleGenerate = () => {
    const values = form.getValues();
    if (!values.clientName || !values.projectName || !values.projectType || !values.clientIndustry) {
      toast({ 
        title: "Missing required fields", 
        description: "Please fill in Client Name, Project Name, Industry, and Project Type before generating.",
        variant: "destructive" 
      });
      return;
    }

    const generateData = {
      clientName: values.clientName,
      projectName: values.projectName,
      clientIndustry: values.clientIndustry,
      projectType: values.projectType,
      budgetRange: values.budgetRange,
      additionalContext: values.additionalContext,
    };

    const defaultEnabledSections = {
      executiveSummary: true, aboutCompany: true, projectOverview: true,
      features: true, technologyStack: true, pricing: true,
      digitalMarketing: true, addOns: true, legalTerms: true, acceptanceSection: true
    };

    const doGenerateAndNavigate = (propId: number) => {
      generateFullProposal.mutate(
        { data: generateData },
        {
          onSuccess: (contentData) => {
            updateProposal.mutate(
              {
                id: propId,
                data: {
                  sections: contentData as any,
                  enabledSections: defaultEnabledSections as any,
                },
              },
              {
                onSuccess: () => {
                  toast({ title: "Proposal generated! Opening preview..." });
                  setLocation(`/proposals/${propId}/preview`);
                }
              }
            );
          },
        }
      );
    };

    if (isNew) {
      const formattedData = {
        ...values,
        projectDate: values.projectDate.toISOString(),
      };
      createProposal.mutate({ data: formattedData }, {
        onSuccess: (newProp) => doGenerateAndNavigate(newProp.id),
      });
    } else if (proposal) {
      // Save current form values first, then generate
      const formattedData = {
        ...values,
        projectDate: values.projectDate.toISOString(),
      };
      updateProposal.mutate({ id: proposal.id, data: formattedData }, {
        onSuccess: () => doGenerateAndNavigate(proposal.id),
      });
    }
  };

  const isSaving = createProposal.isPending || updateProposal.isPending;
  const isGenerating = generateFullProposal.isPending;

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background z-10 sticky top-0">
        <h2 className="text-lg font-serif font-semibold">{isNew ? "New Proposal" : "Edit Details"}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving || isGenerating}
            className="font-medium"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6">
        <Form {...form}>
          <form className="space-y-6 pb-20">
            
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Client Details</h3>
              
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientIndustry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Logo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value} 
                          onChange={field.onChange} 
                          placeholder="Upload logo"
                          className="h-10 border rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Project Details</h3>
              
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digital Transformation Initiative" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_TYPES.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2">
                      <FormLabel className="mb-1">Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="budgetRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $50,000 - $75,000" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Details / Custom Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add specific details or instructions for this proposal (e.g. 'focus on cloud hosting, keep the design section very detailed')..." 
                        className="resize-none h-24 bg-background" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Design & Style</h3>
              <div className="space-y-2">
                <FormLabel>Proposal Color Theme</FormLabel>
                <Select onValueChange={onThemeChange} value={selectedTheme}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full ${t.colorClass} border border-white/10`} />
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Closing Details</h3>
              
              <FormField
                control={form.control}
                name="contactDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your contact info for the acceptance section..." 
                        className="resize-none h-24 bg-background" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signatureUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Signature</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                        placeholder="Upload signature"
                        className="h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
          </form>
        </Form>
      </ScrollArea>
      
      <div className="p-6 bg-background border-t border-border shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] mt-auto sticky bottom-0 z-10">
        <Button 
          className="w-full h-12 text-base font-medium shadow-md shadow-primary/20 hover:shadow-lg transition-all" 
          onClick={handleGenerate}
          disabled={isGenerating || isSaving}
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Proposal...</>
          ) : (
            <><Sparkles className="w-5 h-5 mr-2" /> Generate with AI</>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3 font-mono">
          Fills all proposal sections with investor-grade copy.
        </p>
      </div>
    </div>
  );
}
