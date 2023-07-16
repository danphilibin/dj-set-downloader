import express from "express";
import bodyParser from "body-parser";
import { downloadFromYoutube } from "./youtube";

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

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});
