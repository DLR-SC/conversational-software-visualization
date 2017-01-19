FROM rocketchat/hubot-rocketchat:v1.0.6

COPY ./scripts /home/hubot/scripts

RUN npm install autobahn

ENV env production
ENV EXTERNAL_SCRIPTS hubot-help
ENV ROCKETCHAT_URL rocket:3000
ENV ROCKETCHAT_ROOM PRODUCTION
ENV LISTEN_ON_ALL_PUBLIC=true
ENV ROCKETCHAT_USER Sofia
ENV HUBOT_LOG_LEVEL=debug
#ENV ROCKETCHAT_PASSWORD your-password
ENV BOT_NAME ""



