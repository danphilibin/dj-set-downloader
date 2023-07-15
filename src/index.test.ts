import { downloadFromYoutube } from './index';
import { exec as execOriginal } from 'child_process';
const exec = execOriginal as jest.MockedFunction<typeof execOriginal>;
import { existsSync } from 'fs';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('downloadFromYoutube', () => {
  it('should call exec with the correct arguments', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const filename = 'output.mp3';

    downloadFromYoutube(url, filename, () => {});

    expect(exec).toHaveBeenCalledWith(`yt-dlp -f "bestaudio/best" -x --audio-format mp3 --add-metadata -o ${filename} ${url}`, expect.any(Function));
  });

  it('should call the callback with an error if exec fails', () => {
    const error = new Error('exec error');
    (exec as jest.Mock).mockImplementationOnce((command, callback) => callback(error));

    const callback = jest.fn();

    downloadFromYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'output.mp3', callback);

    expect(callback).toHaveBeenCalledWith(error, false);
  });

  it('should call the callback with true if the file exists', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(true);

    const callback = jest.fn();

    downloadFromYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'output.mp3', callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('should call the callback with an error if the file does not exist', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(false);

    const callback = jest.fn();

    downloadFromYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'output.mp3', callback);

    expect(callback).toHaveBeenCalledWith(new Error('File does not exist'), false);
  });
});
