ALTER TABLE "hexInstance" ADD COLUMN "template" integer NOT NULL;--> statement-breakpoint
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
