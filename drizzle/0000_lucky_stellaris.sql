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
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"name" text NOT NULL,
	"template" integer
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hexInstance" ADD CONSTRAINT "hexInstance_template_hexTemplate_id_fk" FOREIGN KEY ("template") REFERENCES "hexTemplate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hexTemplate" ADD CONSTRAINT "hexTemplate_biome_biome_id_fk" FOREIGN KEY ("biome") REFERENCES "biome"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
