# Service OSGi Visualization UI
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=B-Stefan&repoName=Sofia&branch=master&pipelineName=service-osgi-visualization-ui&accountName=B-Stefan&type=cf-1)]( https://g.codefresh.io/repositories/B-Stefan/Sofia/builds?filter=trigger:build;branch:master;service:5879f74d1148080100b67d71~Sofia-service-context)![Node.js](https://img.shields.io/badge/node.js-6.x.x-green.svg) [![WAMP V2](https://img.shields.io/badge/wamp-2.0-green.svg)](http://wamp-proto.org)

## Getting started

 You need access to the repository: http://gogs.dlr-gogs.default.conts.de/stefan/OSGiVisualization and set the following env. variables:

 * gitUserName: xxxxxx
 * gitUserPass: xxxxxx

```sh

$ docker run sofia/service-osgi-visualization-ui

```

## Development

To setup your environment and start development please read first the [overall project requirements](./../Development.md).

```sh

npm install
open index.html

```


## Deployment

This project uses [codefresh.io](http://codefreh.io) to build and deploy the dockercontainer.
To trigger the build just push your changes to the remote repository