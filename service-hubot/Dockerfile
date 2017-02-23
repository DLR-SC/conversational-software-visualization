FROM node:6

COPY ./ /hubot

WORKDIR /hubot

RUN npm install --production
ENV env production
ENV ROCKETCHAT_URL rocket:3000
ENV ROCKETCHAT_USER Sofia
ENV HUBOT_LOG_LEVEL=debug
#ENV ROCKETCHAT_PASSWORD your-password
ENV BOT_NAME ""

CMD PATH=$(npm bin):$PATH  && ./node_modules/.bin/hubot -a rocketchat




