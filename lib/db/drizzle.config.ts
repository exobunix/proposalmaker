import { defineConfig } from "drizzle-kit";
import path from "path";

const databaseUrl = process.env.DATABASE_URL || "file:../../artifacts/api-server/local.db";

export default defineConfig({
  schema: "./src/schema/proposals.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
