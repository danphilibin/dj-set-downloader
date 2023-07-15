import express from 'express';
import { exec } from 'child_process';
import { existsSync } from 'fs';

const app = express();
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const filename = 'output.mp3';

  exec(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o ${filename} ${url}`, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.send('ERROR');
      return;
    }

    if (existsSync(filename)) {
      res.send('OK');
    } else {
      console.error('File does not exist');
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
