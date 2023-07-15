import { exec } from 'child_process';
import { existsSync } from 'fs';

export const downloadFromYoutube = (url: string, filename: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o ${filename} ${url}`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }

      if (existsSync(filename)) {
        resolve(true);
      } else {
        console.error('File does not exist');
        reject(new Error('File does not exist'));
      }
    });
  });
};
