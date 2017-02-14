FROM danieldent/meteor:1.0.3.1
MAINTAINER Daniel Dent (https://www.danieldent.com/)
RUN git clone https://github.com/RocketChat/Rocket.Chat.git /opt/src
RUN ls /opt/src -l
RUN rm -rf /opt/src/packages/rocketchat-chatops
RUN mkdir /opt/src/packages/rocketchat-chatops
COPY ./rocketchat-chatops /opt/src/packages/rocketchat-chatops
WORKDIR /opt/src
RUN meteor add rocketchat:chatops
#RUN meteor build .. --directory \
#    && cd ../bundle/programs/server \
#    && npm install \
#    && rm -rf /opt/src
WORKDIR /opt/bundle
USER nobody
ENV PORT 3000
#CMD ["/usr/local/bin/node", "main.js"]