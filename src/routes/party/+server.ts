import { error } from '@sveltejs/kit'
import { put, list, del } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { db, party } from '../../schema'
import { eq } from 'drizzle-orm'

export async function PUT({ params, request }) {
  const { x, y, id } = await request.json()
  await db.update(party).set({ x, y }).where(eq(party.id, id)).execute()

  return new Response(null, { status: 204 })
}