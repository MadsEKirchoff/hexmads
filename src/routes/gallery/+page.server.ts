import { error } from '@sveltejs/kit'
import { put, list } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'

export async function load() {
  const blobPromise = list({ token: BLOB_READ_WRITE_TOKEN })
  return {
    nothing: [],
    images: await blobPromise
	}
}

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData()
    const file = form.get('image-upload') as File

    if (!file) {
      error(400, { message: 'No file to upload.' })
    }

    const { url } = await put(file.name, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    })
    return { uploaded: url }
  },
  listImages: async ({ params }) => {
    const { blobs } = await list({ token: BLOB_READ_WRITE_TOKEN })
    return Response.json(blobs);
  },
  deleteImage: async ({ params }) => {
    return await del(url, { token: BLOB_READ_WRITE_TOKEN})
  }
}
