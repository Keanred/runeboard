import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from '../config';
import { columns, tasks } from './schema';

export const sql = postgres(config.databaseUrl);
export const db = drizzle(sql, { schema: { columns, tasks } });