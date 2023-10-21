import express from "express";
import bodyParser from "body-parser";
import { downloadFromYoutube } from "./youtube";
import { listFilesInS3 } from "./upload";

const app = express();
const port = 3000;
const host = "0.0.0.0";

let downloadQueue: string[] = [];
let isDownloading = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const processQueue = async () => {
  if (isDownloading) {
    console.log("Already downloading");
    return;
  }
  if (downloadQueue.length === 0) {
    console.log("Nothing to download");
    return;
  }

  console.log(`Processing queue:`, JSON.stringify(downloadQueue, null, 2));

  isDownloading = true;
  const url = downloadQueue[0];

  try {
    console.log("⬇️ Downloading: ", url);
    await downloadFromYoutube(url);
    console.log("✅ Downloaded: ", url);
    downloadQueue = downloadQueue.slice(1);
  } catch (error) {
    console.error(`🚨 Error downloading: ${error}`);
  }
  isDownloading = false;
  processQueue();
};

// prevents machines from running indefinitely
setInterval(() => {
  if (!isDownloading && downloadQueue.length === 0) {
    process.exit(0);
  }
}, 30000);

app.post("/", async (req, res) => {
  const url = req.body.url;
  downloadQueue.push(url);
  console.log(`⌛ Added to queue: ${url}`);

  processQueue();

  // must return quickly so the shortcut can exit
  res.json({ message: "Download started" });
});

app.get("/", (req, res) => {
  res.status(200).send(JSON.stringify(downloadQueue, null, 2));
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

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});
