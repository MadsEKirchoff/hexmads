import { error } from '@sveltejs/kit'
import { put, list, del } from '@vercel/blob'
import type { ListBlobResult } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'

export async function load() {

  return {
    hexTemplates: await db.select().from(hexTemplate),
    blobList: await list({ token: BLOB_READ_WRITE_TOKEN })
  }
}

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData()
    const file = form.get('image-upload') as File
    const biome = form.get('biome') as number | null

    if (!file) {
      error(400, { message: 'No file to upload.' })
    }

    if (biome) {
      await db.insert(hexTemplate).values({ biome: biome, imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png' }).execute()
    }
    const { url } = await put(file.name, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    })

    return { uploaded: url }
  }
}