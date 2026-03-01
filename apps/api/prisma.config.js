import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma",
  migrations: {
    dir: "prisma/migrations",
    seed: "npx tsx prisma/seed/index.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
