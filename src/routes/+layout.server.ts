import { biome, db } from '../schema.js'

export async function load() {

  return {
    biome: await db.select().from(biome),
  }
}