import { defineConfig } from "drizzle-kit";
import path from "path";
import fs from "fs";

function findWorkspaceRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

const workspaceRoot = findWorkspaceRoot(process.cwd());
const defaultDbPath = path.join(workspaceRoot, "artifacts/api-server/local.db");

let databaseUrl = process.env.DATABASE_URL;

// Ignore MongoDB connection strings in DATABASE_URL for drizzle-kit
if (!databaseUrl || databaseUrl.startsWith("mongodb")) {
  databaseUrl = `file:${defaultDbPath}`;
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
