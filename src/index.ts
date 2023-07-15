import express from 'express';
import { downloadFromYoutube } from './youtube';

const app = express();
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());

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
