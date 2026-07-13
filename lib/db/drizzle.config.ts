import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let databaseUrl = process.env.DATABASE_URL;

// Ignore MongoDB connection strings in DATABASE_URL for drizzle-kit
if (!databaseUrl || databaseUrl.startsWith("mongodb")) {
  databaseUrl = `file:${path.resolve(__dirname, "local.db")}`;
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
