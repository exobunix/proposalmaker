# AI Proposal Generator

## Overview

A full-stack, AI-powered business proposal generator for IT consulting companies. Built with React + Vite frontend and Express backend, powered by OpenAI GPT-5.2 for content generation.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/proposal-generator) — Gold/Black/White premium theme
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (proposals table)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations (no API key needed)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **PDF export**: window.print() with @media print CSS
- **File uploads**: react-dropzone (logo & signature drag-and-drop)

## Key Features

1. **Dashboard** — overview of all proposals with stats (total/draft/sent/approved) and recent proposals grid
2. **New Proposal** (`/proposals/new`) — split-panel form with drag-and-drop logo/signature upload
3. **Edit Proposal** (`/proposals/:id`) — same split-panel view for existing proposals
4. **AI Generation** — "Generate with AI" button populates all 10 sections at once via GPT-5.2
5. **Section AI Rewrite** — rewrite individual sections in 3 tones: Professional, Premium, Startup-Friendly
6. **Section Toggle** — enable/disable individual sections (Executive Summary, About Company, Project Overview, Features, Tech Stack, Pricing, Marketing, Add-Ons, Legal, Acceptance)
7. **Full-Screen Preview** (`/proposals/:id/preview`) — print-ready document view with Cover Page, TOC, formatted sections
8. **PDF Export** — print/save PDF via browser print dialog with print-specific CSS
9. **Proposal Management** — duplicate, delete, status tracking (draft/sent/approved)

## API Routes

- `GET /api/proposals` — list all proposals
- `POST /api/proposals` — create new proposal
- `GET /api/proposals/:id` — get single proposal
- `PUT /api/proposals/:id` — update proposal (includes sections, enabledSections)
- `DELETE /api/proposals/:id` — delete proposal
- `POST /api/proposals/:id/duplicate` — duplicate proposal
- `GET /api/proposals/stats` — dashboard stats
- `POST /api/ai/generate-full-proposal` — generate all 10 sections at once via AI
- `POST /api/ai/generate-content` — generate single section
- `POST /api/ai/rewrite` — rewrite content with tone
- `POST /api/ai/upload-logo` — base64 logo/signature upload

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/proposal-generator run dev` — run frontend locally

## Environment Variables

- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy URL (auto-set by Replit)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI proxy key (auto-set by Replit)
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `SESSION_SECRET` — session secret
- `PORT` — service port (auto-assigned)
- `BASE_PATH` — URL base path (auto-assigned)

## DB Schema

- `proposals` table: id, client_name, project_name, project_date, client_industry, project_type, budget_range, logo_url, contact_details, signature_url, status, sections (jsonb), enabled_sections (jsonb), created_at, updated_at
