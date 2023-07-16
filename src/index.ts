import express from "express";
import bodyParser from "body-parser";
import { downloadFromYoutube } from "./youtube";
import { listFilesInS3 } from "./upload";

const app = express();
const port = 3000;
const host = "0.0.0.0";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const url = req.body.url;
  try {
    const exists = await downloadFromYoutube(url);
    res.json(exists);
  } catch (error) {
    res.send("ERROR");
  }
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
      let html = '<table>';
      files.forEach(file => {
        html += `<tr><td>${file}</td></tr>`;
      });
      html += '</table>';
      res.send(html);
    }
  } catch (error) {
    res.send("ERROR");
  }
});

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
