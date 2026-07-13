import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL || "local.db";
const dbPath = databaseUrl.replace(/^file:/, "");
export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export * from "./schema";
