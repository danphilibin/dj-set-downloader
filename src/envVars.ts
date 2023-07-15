import { z } from "zod";
import "dotenv/config"; // loads environment variables from .env

const envVars = z.object({
  ACCESS_KEY_ID: z.string(),
  ACCESS_KEY_SECRET: z.string(),
  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),
  BUCKET_NAME: z.string(),
});

// throws if vars are missing
envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}
