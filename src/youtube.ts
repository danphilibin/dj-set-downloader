import { exec } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { uploadToS3 } from './upload';

export const downloadFromYoutube = (url: string): Promise<{ success: boolean; filename: string }> => {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o '%(title)s.%(ext)s' ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject({ success: false, filename: '' });
        return;
      }

      let outputLine = stdout.split('\n').find(line => line.includes('[download] Destination:'));
      if (outputLine) {
        let outputFilename = outputLine.split(': ')[1].replace('.webm', '.mp3');
        if (existsSync(outputFilename)) {
          uploadToS3(outputFilename)
            .then(() => {
              unlinkSync(outputFilename);
              resolve({ success: true, filename: outputFilename });
            })
            .catch((uploadErr) => {
              console.error(`Error uploading file: ${uploadErr}`);
              reject({ success: false, filename: '' });
            });
        } else {
          console.error('File does not exist');
          reject({ success: false, filename: '' });
        }
      }
    });
  });
};
