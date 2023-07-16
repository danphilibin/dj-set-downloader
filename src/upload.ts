import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadCommand, ListObjectsCommand, S3Client, ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import fs from "fs";
import "./envVars";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  },
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
});

export const listFilesInS3 = async (): Promise<string[]> => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: 'dj-sets/'
  };

  const command = new ListObjectsCommand(params);
  const response = await s3.send(command) as ListObjectsCommandOutput;
  return response.Contents?.map(file => file.Key || '') || [];
};

export const uploadToS3 = async (filename: string): Promise<void> => {
  const fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `dj-sets/${filename}`,
    Body: fileContent,
  };

  try {
    console.log(`Starting upload to S3 for file: ${filename}`);
    const data = await new Upload({
      client: s3,
      params,
    }).done();
    if (data instanceof CompleteMultipartUploadCommand && "Location" in data) {
      console.log(`File uploaded successfully. S3 location: ${data.Location}`);
    }
  } catch (err) {
    console.error(`Error uploading file: ${err}`);
  }
};
