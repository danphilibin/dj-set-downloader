import { exec } from 'child_process';
import { existsSync } from 'fs';

export const downloadFromYoutube = (url: string, filename: string, callback: (error: any, exists: boolean) => void) => {
  exec(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o ${filename} ${url}`, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      callback(error, false);
      return;
    }

    if (existsSync(filename)) {
      callback(null, true);
    } else {
      console.error('File does not exist');
      callback(new Error('File does not exist'), false);
    }
  });
};
