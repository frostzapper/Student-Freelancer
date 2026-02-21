-- Add work_location column to Job table
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "work_location" TEXT DEFAULT 'online';

-- Update existing jobs to have random work_location values
UPDATE "Job" SET "work_location" = 
  CASE 
    WHEN id % 2 = 0 THEN 'online'
    ELSE 'offline'
  END
WHERE "work_location" IS NULL OR "work_location" = '';
