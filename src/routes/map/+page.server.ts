import { } from '$env/static/private'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

export async function load({ locals }) {
  // await migrate(db, { migrationsFolder: './drizzle' })
  // seed()
  return {
    db: {
      hexGrid: await db.select().from(hexGrid),
      hexInstance: await db.select().from(hexInstance),
      party: await db.select().from(party),
      // test: await sql`SELECT * from USERS`,
      // test2: await sql`SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'`
    }
  }
}

const seed = async () => {
  await db.insert(hexGrid).values({ name: 'Summerpalace', width: 10, height: 10 }).execute()
  await db.insert(biome).values({ name: 'Bjerg', color: 'bg-gray-700' }).execute()
  await db.insert(party).values({ x: 1, y: 2, imageUrl: 'partyIcon.png' }).execute()
  // await db.insert(hexInstance).values({ x: 2, y: 3, imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png' }).execute()
  // await db.insert(hexTemplate).values({ biome: , imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png' }).execute()
}
