import express from 'express';
import { exec } from 'child_process';
import { existsSync } from 'fs';

const app = express();
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());

const downloadFromYoutube = (url: string, filename: string, callback: (error: any, exists: boolean) => void) => {
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

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const filename = 'output.mp3';

  downloadFromYoutube(url, filename, (error, exists) => {
    if (error) {
      res.send('ERROR');
    } else if (exists) {
      res.send('OK');
    } else {
      res.send('ERROR');
    }
  });
});

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
