import express from 'express';

const app = express();
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());

app.post('/download', (req, res) => {
  const url = req.body.url;
  // TODO: Download MP3 from YouTube, save to S3
  res.send('Download started');
});

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
