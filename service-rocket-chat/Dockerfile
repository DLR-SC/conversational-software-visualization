FROM meteorhacks/meteord:base

MAINTAINER Daniel Dent (https://www.danieldent.com/)

RUN git clone https://github.com/RocketChat/Rocket.Chat.git /app
RUN rm -rf /app/packages/rocketchat-chatops
RUN mkdir /app/packages/rocketchat-chatops
COPY ./rocketchat-chatops /app/packages/rocketchat-chatops
ENV METEOR_ALLOW_SUPERUSER true
ENV environment production
RUN cd /app && npm install --production
RUN bash $METEORD_DIR/lib/install_meteor.sh
RUN cd /app && meteor add sofia:osgi-view --allow-incompatible-update
RUN bash $METEORD_DIR/lib/build_app.sh