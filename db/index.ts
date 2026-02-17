import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let _db: PostgresJsDatabase | null = null;

export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop) {
    if (!_db) {
      if (!process.env.DATABASE_URL) {
        throw new Error(
          "DATABASE_URL is not set. Database features are disabled in local development without a database."
        );
      }
      const sql = postgres(process.env.DATABASE_URL);
      _db = drizzle({ client: sql });
    }
    return (_db as any)[prop];
  },
});
