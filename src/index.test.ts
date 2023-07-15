import { downloadFromYoutube } from "./youtube";
import { exec as execOriginal } from "child_process";
const exec = execOriginal as jest.MockedFunction<typeof execOriginal>;
import { existsSync, unlinkSync } from "fs";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(),
}));

describe("downloadFromYoutube", () => {
  it("should call exec with the correct arguments", async () => {
    const url = "https://www.youtube.com/watch?v=C0DPdy98e4c";
    const filename = "output.mp3";

    const result = await downloadFromYoutube(url, filename);
    expect(result).toBe(true);

    // Remove the file after the test
    unlinkSync(filename);
  });
});
