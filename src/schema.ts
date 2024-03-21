import { sql } from '@vercel/postgres'
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text
} from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { customType } from 'drizzle-orm/pg-core'

export const db = drizzle(sql)

export type buttonColor = "red" | "yellow" | "green" | "purple" | "blue" | "light" | "dark" | "primary" | "none" | "alternative" | "none"

const customcolor = customType<{ data: buttonColor }>({
  dataType() {
    return 'text'
  },
})


export const hexGrid = pgTable("hexGrid", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  width: integer("width"),
  height: integer("height"),
  backgroundImage: text("backgroundImage"),
})
export const hexInstance = pgTable("hexInstance", {
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  imageUrl: text("name").notNull(),
  template: integer("template").references(() => hexTemplate.id)
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
  color: customcolor("color")
})