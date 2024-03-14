import dotenvExpand from 'dotenv-expand'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  driver: 'pg', //'mysql2', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    host: "ep-billowing-mud-a4h8pb08-pooler.us-east-1.aws.neon.tech",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "verceldb",
  },
} satisfies Config