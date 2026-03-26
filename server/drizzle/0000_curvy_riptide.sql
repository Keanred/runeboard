CREATE TABLE "columns" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"column_id" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_column_id_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."columns"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "tasks_column_id_idx" ON "tasks" USING btree ("column_id");