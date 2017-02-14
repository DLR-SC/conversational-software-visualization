FROM danieldent/meteor:1.0.3.2
MAINTAINER Daniel Dent (https://www.danieldent.com/)
RUN git clone https://github.com/RocketChat/Rocket.Chat.git /opt/src
RUN ls /opt/src -l
RUN rm -rf /opt/src/packages/rocketchat-chatops
RUN mkdir /opt/src/packages/rocketchat-chatops
COPY ./rocketchat-chatops /opt/src/packages/rocketchat-chatops


RUN ls /opt/src/packages/rocketchat-chatops -l
RUN cat /opt/src/packages/rocketchat-chatops/package.js
RUN export METEOR_ALLOW_SUPERUSER=true
USER nobody
WORKDIR /opt/src
RUN ls -l
RUN meteor help
RUN meteor add sofia:osgi-view
RUN meteor build .. --directory \
    && cd ../bundle/programs/server \
    && npm install \
    && rm -rf /opt/src
WORKDIR /opt/bundle
ENV PORT 3000
#CMD ["/usr/local/bin/node", "main.js"]