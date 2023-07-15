import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3();

export const uploadToS3 = async (filename: string, bucketName: string): Promise<void> => {
  const fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: fileContent
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch (err) {
    console.error(`Error uploading file: ${err}`);
  }
};
