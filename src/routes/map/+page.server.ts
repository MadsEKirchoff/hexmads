import { } from '$env/static/private'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'

export async function load({ locals }) {

  return {
    hexGrid: await db.select().from(hexGrid),
    hexInstance: await db.select().from(hexInstance),
    party: await db.select().from(party),
    biome: await db.select().from(biome),
    // test2: await sql`SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'`
  }
}
