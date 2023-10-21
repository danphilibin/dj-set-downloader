import { exec } from "child_process";
import { existsSync, unlinkSync } from "fs";
import { uploadToS3 } from "./upload";

export const downloadFromYoutube = (
  url: string
): Promise<{ success: boolean; filename: string }> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting download from YouTube for URL: ${url}`);
    exec(
      `yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o '%(uploader)s %(title)s.%(ext)s' ${url.trim()}`,
      (error, stdout, stderr) => {
        console.log("Download completed");
        if (error) {
          console.error(`exec error: ${error}`);
          reject({ success: false, filename: "" });
          return;
        }

        let outputLine = stdout
          .split("\n")
          .find((line) => line.includes("[download] Destination:"));
        if (outputLine) {
          let outputFilename = outputLine
            .split(": ")[1]
            .replace(".webm", ".mp3");
          if (existsSync(outputFilename)) {
            console.log(`Starting upload to S3 for file: ${outputFilename}`);
            uploadToS3(outputFilename)
              .then(() => {
                console.log("Upload completed");
                console.log(`Deleting local file: ${outputFilename}`);
                unlinkSync(outputFilename);
                resolve({ success: true, filename: outputFilename });
              })
              .catch((uploadErr) => {
                console.error(`Error uploading file: ${uploadErr}`);
                reject({ success: false, filename: "" });
              });
          } else {
            console.error("File does not exist");
            reject({ success: false, filename: "" });
          }
        }
      }
    );
  });
};
