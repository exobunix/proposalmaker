import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = sqliteTable("proposals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  sections: text("sections", { mode: "json" }),
  enabledSections: text("enabled_sections", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;
