CREATE TABLE IF NOT EXISTS "biome" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hexGrid" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"width" integer,
	"height" integer,
	"backgroundImage" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hexInstance" (
	"id" serial PRIMARY KEY NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hexTemplate" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"biome" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "party" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL
);
