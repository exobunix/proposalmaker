import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  projectName: text("project_name").notNull(),
  projectDate: text("project_date").notNull(),
  clientIndustry: text("client_industry").notNull(),
  projectType: text("project_type").notNull(),
  budgetRange: text("budget_range"),
  logoUrl: text("logo_url"),
  contactDetails: text("contact_details"),
  signatureUrl: text("signature_url"),
  status: text("status").notNull().default("draft"),
  sections: jsonb("sections"),
  enabledSections: jsonb("enabled_sections"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;
