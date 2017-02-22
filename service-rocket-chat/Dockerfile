FROM tozd/runit

EXPOSE 3000/tcp

ENV ROOT_URL http://example.com
ENV MAIL_URL smtp://user:password@mailhost:port/
ENV METEOR_SETTINGS {}
ENV PORT 3000
ENV MONGO_URL mongodb://mongodb/meteor
ENV MONGO_OPLOG_URL mongodb://mongodb/local
ENV HOME /

VOLUME /var/log/meteor

RUN apt-get update -q -q && \
 apt-get --yes --force-yes install curl python build-essential && \
 export METEOR_ALLOW_SUPERUSER=true && \
 curl https://install.meteor.com/ | sed s/--progress-bar/-sL/g | sh && \
 apt-get --yes --force-yes purge curl && \
 apt-get --yes --force-yes autoremove && \
 apt-get install --yes --force-yes git-all && \
 adduser --system --group meteor --home / && \
 export "NODE=$(find /.meteor/ -path '*bin/node' | grep '/.meteor/packages/meteor-tool/' | sort | head -n 1)" && \
 ln -sf ${NODE} /usr/local/bin/node

RUN git clone https://github.com/RocketChat/Rocket.Chat.git /source && cd /source && git checkout tags/0.50.1
RUN rm -rf /source/packages/rocketchat-sofia
RUN mkdir /source/packages/rocketchat-sofia
COPY ./rocketchat-sofia /source/packages/rocketchat-sofia

RUN export METEOR_ALLOW_SUPERUSER=true && \
 if [ -x /source/docker-source.sh ]; then /source/docker-source.sh; fi && \
 cp -a /source /build && \
 rm -rf /source && \
 cd /build && \
 meteor list && \
 if [ -f package.json ]; then meteor npm install --production; fi && \
 meteor add sofia:osgi-view && \
 meteor build --headless . && \
 cd / && \
 tar xf /build/build.tar.gz && \
 rm -rf /build

WORKDIR /bundle
RUN cd programs/server && meteor npm install
CMD node main.js

#FROM kadirahq/meteord:base

#MAINTAINER Daniel Dent (https://www.danieldent.com/)


#RUN rm -rf /app/packages/rocketchat-sofia
#RUN mkdir /app/packages/rocketchat-sofia
#COPY ./rocketchat-sofia /app/packages/rocketchat-sofia
#ENV METEOR_ALLOW_SUPERUSER true
#ENV environment production
#RUN npm cache clear && \
#    npm install -g npm@latest-2 && \
#    npm cache clear && \
#    bash $METEORD_DIR/lib/install_meteor.sh && \
#    cd /app && meteor update && \
#    cd /app && meteor npm install --production && \
#    cd /app && meteor add sofia:osgi-view --allow-incompatible-update && \
#    bash $METEORD_DIR/lib/build_app.sh