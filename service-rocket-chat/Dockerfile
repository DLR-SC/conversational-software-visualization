FROM kadirahq/meteord:base

MAINTAINER Daniel Dent (https://www.danieldent.com/)

RUN git clone https://github.com/RocketChat/Rocket.Chat.git /app
RUN rm -rf /app/packages/rocketchat-chatops
RUN mkdir /app/packages/rocketchat-chatops
COPY ./rocketchat-chatops /app/packages/rocketchat-chatops
ENV METEOR_ALLOW_SUPERUSER true
ENV environment production
RUN npm cache clear && \
    npm install -g npm@latest-2 && \
    npm cache clear && \
    bash $METEORD_DIR/lib/install_meteor.sh && \
    meteor update && \
    cd /app && meteor npm install --production && \
    cd /app && meteor add sofia:osgi-view --allow-incompatible-update && \
    bash $METEORD_DIR/lib/build_app.sh