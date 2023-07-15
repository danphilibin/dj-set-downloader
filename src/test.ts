import { downloadFromYoutube } from "./youtube";
import { existsSync } from "fs";

const testUrl = "https://www.youtube.com/watch?v=C0DPdy98e4c";
downloadFromYoutube(testUrl)
  .then(({ success, filename }) => {
    if (success) {
      console.log(`Download successful: ${filename}`);
    } else {
      console.log("Download failed");
    }
  })
  .catch(({ success, filename }) => {
    if (existsSync(filename)) {
      console.error(`Download failed: ${filename}`);
    } else {
      throw new Error(`File ${filename} not found`);
    }
  });
