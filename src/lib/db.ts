import { Pool } from "pg";

let pool: Pool | null = null;

function getPool() {
	if (pool) {
		return pool;
	}

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	pool = new Pool({ connectionString });
	return pool;
}

export const db = {
	query: <T = unknown>(text: string, values: unknown[] = []) => {
		return getPool().query<T>(text, values);
	},
};
