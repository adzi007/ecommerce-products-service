import { createPool, createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import 'dotenv/config';
import * as schema  from 'drizzle/drizzle.schemas';
// import { drizzle } from "drizzle-orm/singlestore/driver";
// import { db } from "drizzle/drizzle.schemas"; // Path to the generated query helpers

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// export const db = drizzle(pool);

// const db = drizzle({ schema });

export const db = drizzle(pool, { schema, mode: 'default', logger: true });

// export const db = drizzle({ connection:{ uri: process.env.DATABASE_URL }, schema: { ...productsTable } });

// export const db = drizzle(pool);

// const connection = createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// export const db = drizzle({ client: connection });
