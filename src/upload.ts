import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
});

export const uploadToS3 = async (filename: string): Promise<void> => {
  const fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: fileContent,
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch (err) {
    console.error(`Error uploading file: ${err}`);
  }
};
