
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/drizzle.schemas.ts',
  dialect: 'mysql',
  // strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});