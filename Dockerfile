FROM node:20

WORKDIR /app

COPY package*.json ./

RUN yarn install

RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && yt-dlp --version

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
