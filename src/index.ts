import express from "express";
import bodyParser from "body-parser";
import { downloadFromYoutube } from "./youtube";
import { listFilesInS3 } from "./upload";

const app = express();
const port = 3000;
const host = "0.0.0.0";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let downloadQueue: string[] = [];
let isDownloading = false;

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

const processQueue = async () => {
  if (isDownloading) {
    return;
  }
  if (downloadQueue.length === 0) {
    process.exit(0);
  }
  isDownloading = true;
  const url = downloadQueue[0];
  try {
    await downloadFromYoutube(url);
    downloadQueue = downloadQueue.slice(1);
  } catch (error) {
    console.error(`Error downloading: ${error}`);
  }
  isDownloading = false;
  processQueue();
};

app.post("/", (req, res) => {
  const url = req.body.url;
  downloadQueue.push(url);
  processQueue();
  res.json({ message: "Download started" });
});

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/files", async (req, res) => {
  try {
    const files = await listFilesInS3();
    if (files.length === 0) {
      res.send("No files");
    } else {
      let html = "<table>";
      files.forEach((file) => {
        html += `<tr><td>${file}</td></tr>`;
      });
      html += "</table>";
      res.send(html);
    }
  } catch (error) {
    res.send("ERROR");
  }
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
