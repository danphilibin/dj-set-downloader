import { exec } from 'child_process';
import { existsSync } from 'fs';

export const downloadFromYoutube = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o '%(title)s.%(ext)s' ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }

      const outputFilename = stdout.split('\n').find(line => line.includes('[download] Destination:'));
      if (outputFilename && existsSync(outputFilename.split(': ')[1])) {
        resolve(true);
      } else {
        console.error('File does not exist');
        reject(new Error('File does not exist'));
      }
    });
  });
};
