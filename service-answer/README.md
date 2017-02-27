# Service Anwser 
[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=B-Stefan&repoName=Sofia&branch=master&pipelineName=service-anwser&accountName=B-Stefan&type=cf-1)]( https://g.codefresh.io/repositories/B-Stefan/Sofia/builds?filter=trigger:build;branch:master;service:587db587c07e7d01005a9911~Sofia-service-anwser)  ![Python 3.5](https://img.shields.io/badge/python-3.5-green.svg) [![WAMP V2](https://img.shields.io/badge/wamp-2.0-green.svg)](http://wamp-proto.org)

## Getting started 

```sh 

$ docker run sofia/service-anwser 

```

## Development 

To setup your environment and start development please read firs the [overall project requirements](./../Development.md). 

We recommend to use a virtual env or some similar technique and execute: 

```
$ python -v # should be > Python 3.5.1
$ python setup.py install 
$ python setup.py test 

```


## Deployment 

This project uses [codefresh.io](http://codefreh.io) to build and deploy the dockercontainer. 
To trigger the build just push your changes to the remote repository 