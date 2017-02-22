# Service Rocket Chat
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=B-Stefan&repoName=Sofia&branch=master&pipelineName=Sofia-service-rocket-chat&accountName=B-Stefan&type=cf-1)]( https://g.codefresh.io/repositories/B-Stefan/Sofia/builds?filter=trigger:build;branch:master;service:587db587c07e7d01005a9911~Sofia-service-rocket-chat)  ![Node.js](https://img.shields.io/badge/node.js-4.x.x-green.svg) [![WAMP V2](https://img.shields.io/badge/wamp-2.0-green.svg)](http://wamp-proto.org)

## Getting started 

```sh 

$ docker run sofia/service-rocket-chat 

```

## Development 

To setup your environment and start development please read first the [overall project requirements](./../Development.md).

**This dynamic added extension is highly experimental!**

To setup a local development environment fork the [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) repository, copy the [`rocketchat-sofia/`](./rocketchat-sofia/) folder into [`packages/`](https://github.com/RocketChat/Rocket.Chat/tree/develop/packages) folder and execute `meteor add sofia:osgi-view` in the root folder of the Rocket.Chat source code.

Example code to setup local env.

```sh
git clone https://github.com/RocketChat/Rocket.Chat.git rocket
cd ./rocket
git checkout tags/0.52.0
cd ..
mkdir ./rocket/packages/rocketchat-sofia
cp ./rocketchat-sofia ./rocket/packages/rocketchat-sofia
cd rocket
meteor add sofia:osgi-view
meteor  #Start the app

```

## Deployment 

This project uses [codefresh.io](http://codefreh.io) to build and deploy the dockercontainer. 
To trigger the build just push your changes to the remote repository 