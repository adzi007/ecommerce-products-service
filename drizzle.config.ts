
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log("DATABASE_URL >>>>>>> ", process.env.DATABASE_URL);


export default defineConfig({
  out: './drizzle',
  schema: './drizzle/drizzle.schemas.ts',
  dialect: 'mysql',
  // strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});