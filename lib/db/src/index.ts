import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
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

// Dynamically resolve workspace root relative to current working directory
const workspaceRoot = findWorkspaceRoot(process.cwd());
const defaultDbPath = path.join(workspaceRoot, "artifacts/api-server/local.db");

let databaseUrl = process.env.DATABASE_URL;

// Ignore MongoDB connection strings in DATABASE_URL
if (!databaseUrl || databaseUrl.startsWith("mongodb")) {
  databaseUrl = `file:${defaultDbPath}`;
}

const dbPath = databaseUrl.replace(/^file:/, "");

export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export * from "./schema";
