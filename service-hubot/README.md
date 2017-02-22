# Service Hubot 
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=B-Stefan&repoName=Sofia&branch=master&pipelineName=service-hubot&accountName=B-Stefan&type=cf-1)]( https://g.codefresh.io/repositories/B-Stefan/Sofia/builds?filter=trigger:build;branch:master;service:587e5febc07e7d01005bf971~Sofia-service-hubot)![Node.js](https://img.shields.io/badge/node.js-6.x.x-green.svg) [![WAMP V2](https://img.shields.io/badge/wamp-2.0-green.svg)](http://wamp-proto.org)

## Getting started

```sh

$ docker run sofia/service-hubot

```

## Development

To setup your environment and start development please read first the [overall project requirements](./../Development.md).

If you want to setup a local development env. please follow the [Hubot getting started instructions](https://hubot.github.com/docs/)

## Deployment

This project uses [codefresh.io](http://codefreh.io) to build and deploy the dockercontainer.
To trigger the build just push your changes to the remote repository