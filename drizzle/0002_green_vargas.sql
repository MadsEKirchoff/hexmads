ALTER TABLE "hexInstance" RENAME COLUMN "name" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "hexTemplate" RENAME COLUMN "name" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "party" RENAME COLUMN "name" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "hexInstance" ADD COLUMN "hexGrid" integer;--> statement-breakpoint
ALTER TABLE "hexInstance" ADD COLUMN "localImageUrl" text;--> statement-breakpoint
ALTER TABLE "hexTemplate" ADD COLUMN "localImageUrl" text;--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "localImageUrl" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hexInstance" ADD CONSTRAINT "hexInstance_hexGrid_hexGrid_id_fk" FOREIGN KEY ("hexGrid") REFERENCES "hexGrid"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
