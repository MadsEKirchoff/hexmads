import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { error } from '@sveltejs/kit'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'
import { put } from '@vercel/blob'
import { formBody } from "$lib/serverUtil"
import { relations, type InferSelectModel, eq } from "drizzle-orm"

export async function load({ locals }) {

  return {
    hexGrid: await db.select().from(hexGrid),
    hexInstance: await db.select().from(hexInstance),
    party: await db.select().from(party),
    biome: await db.select().from(biome),
  }
}

export const actions = {
  createHexInstance: async (event) => {
    const form: FormData = await event.request.formData()
    const file = form.get('hex-image') as File
    if (!file) {
      error(400, { message: 'No file to upload.' })
    }

    const { url } = await put(file.name, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    })

    const id = form.get('id')
    const hex = {
      x: Number(form.get('x')),
      y: Number(form.get('y')),
      hexGrid: Number(form.get('hexGrid')),
      imageUrl: url,
      localImageUrl: String(form.get('localImageUrl')),
    }

    const existingId = Number(form.get('id'))

    if (existingId)
      await db.update(hexInstance).set(hex).where(eq(hexInstance.id, existingId)).execute()
    else
      await db.insert(hexInstance).values(hex).execute()

    return { uploaded: url }
  }
}