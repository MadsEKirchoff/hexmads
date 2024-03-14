import { sql } from '@vercel/postgres'
import {
  integer,
  pgTable,
  serial,
  text
} from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/vercel-postgres'

export const db = drizzle(sql)

export const hexGrid = pgTable("hexGrid", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  width: integer("width"),
  height: integer("height"),
  backgroundImage: text("backgroundImage"),
})
export const hexInstance = pgTable("hexInstance", {
  id: serial("id").primaryKey(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  image: text("name").notNull(),
  template: integer("template").notNull().references(() => hexTemplate.id)
})
export const hexTemplate = pgTable("hexTemplate", {
  id: serial("id").primaryKey(),
  imageUrl: text("name").notNull(),
  biome: integer("biome").notNull().references(() => biome.id)
})
export const party = pgTable("party", {
  id: serial("id").primaryKey(),
  imageUrl: text("name").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull()
})
export const biome = pgTable("biome", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
})