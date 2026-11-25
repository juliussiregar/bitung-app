import { Pool, type PoolConfig } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment (e.g. Vercel project env or .env.local)."
    );
  }

  const poolConfig: PoolConfig = {
    connectionString,
    // Keep pool small for serverless (Vercel) to avoid exhausting DB connections.
    max: Number(process.env.DB_POOL_MAX || 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  };

  // Arteloka / self-hosted DB may run without SSL. Opt in with DB_SSL=true if needed later.
  if (process.env.DB_SSL === "true") {
    poolConfig.ssl = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  pool = new Pool(poolConfig);
  return pool;
}

export async function query(text: string, params?: unknown[]) {
  return getPool().query(text, params);
}

export default {
  query: (text: string, params?: unknown[]) => getPool().query(text, params),
};
