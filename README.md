# Sofia 

The Sofia project ( **So**ftware "**F**ramework" for **I**nteraction with Software **A**rchitecture) emerged during my bachelor thesis. It is a prototype implementation of a microservice architecture for chat bot interaction with source code visualizations.

## Requirements 

* Docker >= 1.12.3 
* Docker-Compose  >= 1.8

## Getting started 

```sh

$ docker-compose .

```

## Architecture

The project consists of 4 services 

* [Question Service](./service-question/)
* [Context Service](./service-context/)
* [OSGi Data Service](./service-osgi-data)
* [OSGi Visualization Service](./service-osgi-visualization)