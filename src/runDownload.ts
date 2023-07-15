import { downloadFromYoutube } from './youtube';

const testUrl = 'https://www.youtube.com/watch?v=C0DPdy98e4c';
downloadFromYoutube(testUrl)
  .then(({ success, filename }) => {
    if (success) {
      console.log(`Download successful: ${filename}`);
    } else {
      console.log('Download failed');
    }
  })
  .catch(({ success, filename }) => {
    console.error(`Download failed: ${filename}`);
  });
