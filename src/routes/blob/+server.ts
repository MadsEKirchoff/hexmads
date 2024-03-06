import { error } from '@sveltejs/kit'
import { put, list, del } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'

export async function DELETE({ params, request }) {
  const {url} = await request.json()
  console.log(`🚀 > DELETE > url:`, url)
  await del(url, { token: BLOB_READ_WRITE_TOKEN })
  return new Response(null, { status: 204 })
}