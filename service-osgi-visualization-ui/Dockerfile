FROM node:boron

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

# Bundle app source
COPY . /usr/src/app

CMD ["npm", "start"]
