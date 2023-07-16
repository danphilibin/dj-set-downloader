import express from "express";
import { downloadFromYoutube } from "./youtube";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/download", async (req, res) => {
  const url = req.body.url;
  try {
    const exists = await downloadFromYoutube(url);
    res.json(exists);
  } catch (error) {
    res.send("ERROR");
  }
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
