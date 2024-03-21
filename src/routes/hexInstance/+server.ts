export async function PUT({ params, request }) {
  const { url } = await request.json()
  // await put(url, { token: BLOB_READ_WRITE_TOKEN })

  return new Response(null, { status: 204 })
}