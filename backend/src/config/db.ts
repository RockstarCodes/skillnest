import mysql from "mysql2/promise";
import { env } from "./env";

export const dbPool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

export async function assertDbConnection(): Promise<void> {
  const conn = await dbPool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

