import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrate: {
    migrations: "prisma/migrations",
    seed: "npx tsx prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
