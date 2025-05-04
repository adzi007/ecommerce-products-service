import { createPool, createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import 'dotenv/config';
import * as schema  from '../drizzle/drizzle.schemas';

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema, mode: 'default', logger: true });
