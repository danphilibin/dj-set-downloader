import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/download', (req, res) => {
  const url = req.body.url;
  // TODO: Download MP3 from YouTube, save to S3
  res.send('Download started');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
