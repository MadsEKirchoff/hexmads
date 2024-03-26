import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { error } from '@sveltejs/kit'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'
import { put } from '@vercel/blob'
import { formBody } from "$lib/serverUtil"

export async function load({ locals }) {

  return {
    hexGrid: await db.select().from(hexGrid),
    hexInstance: await db.select().from(hexInstance),
    party: await db.select().from(party),
    biome: await db.select().from(biome),
    // test2: await sql`SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'`
  }
}


export const actions = {
  uploadInstance: async ({ request }) => {
    const form: FormData = await request.formData()
    const formObj = formBody(form)
    const file = form.get('hex-image') as File
    if (!file) {
      error(400, { message: 'No file to upload.' })
    }
    const { url } = await put(file.name, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    })

    console.log(`🚀 > uploadInstance: > file:`, file)
    const hexInstance = {
      x: formObj.x,
      y: formObj.y,
      hexGrid: formObj.hexGrid,
      imageUrl: url,
      localImageUrl: file.name,
    }


    const grid = form.get('grid') as number | null
    console.log(`🚀 > uploadInstance: > grid:`, grid)

    if (biome) {
      await db.insert(hexInstance).values(hexInstance).execute()
    }


    return { uploaded: url }
  }
}