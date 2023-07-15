import { downloadFromYoutube } from './youtube';

const testUrl = 'https://www.youtube.com/watch?v=C0DPdy98e4c';
const filename = 'output.mp3';

downloadFromYoutube(testUrl, filename)
  .then((exists) => console.log(`Download successful: ${exists}`))
  .catch((error) => console.error(`Download failed: ${error}`));
