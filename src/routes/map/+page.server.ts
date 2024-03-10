import { } from '$env/static/private'
import { sql } from '@vercel/postgres'

export async function load({ locals }) {
  return {
    db: await sql`SELECT * from USERS`
  }
}