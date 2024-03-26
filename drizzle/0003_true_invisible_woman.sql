ALTER TABLE "hexInstance" ALTER COLUMN "hexGrid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hexInstance" ALTER COLUMN "imageUrl" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hexInstance" ADD COLUMN "id" serial NOT NULL;