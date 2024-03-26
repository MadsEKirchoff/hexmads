import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'
import { biome, db, hexGrid, hexInstance, hexTemplate, party } from '../../schema.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'


export async function load({ locals }) {

  await db.delete(hexTemplate)
  await db.delete(hexInstance)
  await db.delete(hexGrid)
  await db.delete(party)
  await db.delete(biome)
  await db.delete(party)

  await migrate(db, { migrationsFolder: './drizzle' })

  await db.insert(biome).values({ name: 'Plains', color: 'green' }).execute()
  await db.insert(biome).values({ name: 'Snowplains', color: 'none' }).execute()
  await db.insert(biome).values({ name: 'Marshes', color: 'red' }).execute()

  await db.insert(biome).values({ name: 'Desert', color: 'yellow' }).execute()
  await db.insert(biome).values({ name: 'Badlands', color: 'dark' }).execute()
  // await db.insert(biome).values({ name: 'Aske', color: 'dark' }).execute()
  // await db.insert(biome).values({ name: 'Aske', color: 'dark' }).execute()

  await db.insert(hexGrid).values({ name: 'Summerpalace', width: 20, height: 20 }).execute()
  await db.insert(party).values({ x: 1, y: 1, imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/undefined%20-%20Imgur-VF8xhEijR8sVHdBXejIOCR4YMdtUGO.png' }).execute()
  // await db.insert(hexInstance).values({ x: 2, y: 3, imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png' }).execute()
  // await db.insert(hexTemplate).values({ imageUrl: 'https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png' }).execute()
}