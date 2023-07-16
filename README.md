# 📀⏬ dj-set-downloader

This is a simple Node.js app that runs on [Fly machines](https://fly.io/docs/machines/) and exposes a POST endpoint that downloads DJ sets from YouTube and Soundcloud to my personal S3 bucket.

**I built this app _entirely_ with [aider](https://aider.chat)**, a command-line chat tool that allows you to write and edit code with OpenAI’s GPT models. If you're curious about what that process was like, I've included the full [chat log](./aider.chat.history.md) and the [input history](./.aisder.input.histry) in this repo. Aside from a few syntax fixes and the Fly.io setup, everything in this repo was written by Aider and GPT-4.

### Motivation

I've seen some of my favorite DJ sets disappear from YouTube and Soundcloud over the years and I wanted a way to easily archive them somewhere for personal use. The ideal solution for me is an iOS Shortcut that integrates with the share sheet on iOS and [Raycast](https://www.raycast.com) on macOS and sends a URL off to a server that does all the work. Thanks to Aider I was able to put this together in a little over an hour.

### Deployment

This app is designed to run on [Fly machines](https://fly.io/docs/machines/) and store files on S3-compatible storage (Amazon S3, Backblaze B2, etc). Follow these step to run your own instance:

Clone this repo locally, then run the `setup` script (`yarn setup`, `npm run setup`, etc) to create a new Fly app, import your S3 credentials, and deploy the app.

If you want to deploy from GitHub Actions, first create a deployment secret:

```bash
$ fly tokens create deploy -x 999999h
```

Fork this repo to your GitHub account and create a new secret in GitHub under **Settings** > **Secrets and variables** > **Actions** called `FLY_API_TOKEN` and paste the token you created above.

In your fork, you'll need to update `fly.toml` with the name and region of your app. These should be added automatically when you run the setup script.
