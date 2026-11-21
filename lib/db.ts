import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://sakata_user:sakata_pass@127.0.0.1:64543/bpbd_bitung";

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

export default pool;
