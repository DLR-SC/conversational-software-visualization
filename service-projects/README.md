# Service Projects
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=B-Stefan&repoName=Sofia&branch=master&pipelineName=Sofia-service-projects&accountName=B-Stefan&type=cf-1)]( https://g.codefresh.io/repositories/B-Stefan/Sofia/builds?filter=trigger:build;branch:master;service:5879f74d1148080100b67d71~Sofia-service-projects)

## Getting started

**This is only a case study for a javascript service, not part of the system at least for now**

```sh

$ docker run sofia/service-projects

```

## Development

To setup your environment and start development please read firs the [overall project requirements](./../Development.md).

We recommend to use a virtual env or some similar technique and execute:

```
$ npm install
$ npm test
$ npm start

```


## Deployment

This project uses [codefresh.io](http://codefreh.io) to build and deploy the dockercontainer.
To trigger the build just push y