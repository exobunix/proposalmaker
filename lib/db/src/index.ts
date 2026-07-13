import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve local.db to a stable absolute path relative to this file's directory: lib/db/local.db
const defaultDbPath = path.resolve(__dirname, "../local.db");

let databaseUrl = process.env.DATABASE_URL;

// If DATABASE_URL is not set or points to MongoDB (leftover environment configuration), fallback to local SQLite
if (!databaseUrl || databaseUrl.startsWith("mongodb")) {
  databaseUrl = `file:${defaultDbPath}`;
}

const dbPath = databaseUrl.replace(/^file:/, "");

export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export * from "./schema";
