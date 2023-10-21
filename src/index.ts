import express from "express";
import bodyParser from "body-parser";
import { downloadFromYoutube } from "./youtube";
import { listFilesInS3 } from "./upload";
import { sendEmail } from "./mailer";

const app = express();
const port = 3000;
const host = "0.0.0.0";

let downloadQueue: Set<string> = new Set();
let isDownloading = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const processQueue = async () => {
  if (isDownloading) {
    console.log("Already downloading");
    return;
  }
  if (downloadQueue.size === 0) {
    console.log("Nothing to download");
    return;
  }

  console.log(
    `Processing queue:`,
    JSON.stringify(Array.from(downloadQueue), null, 2)
  );

  isDownloading = true;
  const url = downloadQueue.values().next().value;

  try {
    console.log("⬇️ Downloading: ", url);
    await downloadFromYoutube(url);
    console.log("✅ Downloaded: ", url);
    downloadQueue.delete(url);
  } catch (error) {
    console.error(`🚨 Error downloading: ${error}`);

    await sendEmail({
      to: "dan@danphilibin.com",
      subject: "[dj-set-downloader] Error downloading video",
      messageBody: `Error downloading video: ${error}`,
    });
  }
  isDownloading = false;
  processQueue();
};

// prevents machines from running indefinitely
setInterval(() => {
  if (!isDownloading && downloadQueue.size === 0) {
    process.exit(0);
  }
}, 30000);

function addToQueue(url: string) {
  downloadQueue.add(url);
}

app.post("/", async (req, res) => {
  const url = req.body.url;
  addToQueue(url);
  console.log(`⌛ Added to queue: ${url}`);

  processQueue();

  // must return quickly so the shortcut can exit
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

app.get("/queue", (req, res) => {
  res.send(JSON.stringify(Array.from(downloadQueue), null, 2));
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});
