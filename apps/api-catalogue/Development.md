# Development - API Catalogue Web App and X-Road Collector
This document describes how to start the front end app Api Catalogue (Viskuausan).
Here you can find the [Wireframe] for the app and this is it's [Repository folder](https://github.com/island-is/island.is/tree/master/apps/api-catalogue) on GitHub.

These instructions where made for windows environment with [Docker Desktop] app 
and [Git Bash] and [yarn] installed.

**Note, When shell command `cd ./island.is` is mentioned, it means you should be located
in the root of this repository disk folder.

**TO be able to do anything in this repo, you will need to install needed packages by giving the following command**
```shell
yarn
yarn postinstall
```

## Elastic Container - Create, add data and run

#### Creating the container
Open Git Bash shell
```shell
	cd  ./island.is
    docker-compose -f ./libs/api-catalogue/elastic/elastic.yml up
```
#### Adding test data to container
Open Git Bash shell
```shell
	cd  ./island.is
    curl -H 'Content-Type: application/x-ndjson' -XPOST localhost:9200/_bulk --data-binary '@./libs/api-catalogue/elastic/initialData.txt'
```
If you need to delete the data you can do it with this command `curl -XDELETE localhost:9200/apicatalogue`


## Start the X-Road Collector
To be able to start the X-Road Collector, the Elastic Container needs to  be running.
Open Git Bash shell
```shell
    yarn nx run services-xroad-collector:serve
```
...Or alternatively, One-liner `yarn start services-xroad-collector`

To test if in elastic `curl http://localhost:9200/apicatalogue/_search`

## Start GraphQL 
This command: `yarn postinstall` needs to be run after a any schema change.

These commands are needed for each open shell window `` and ``.

Open Git Bash shell
```shell
yarn postinstall
export XROAD_BASE_PATH=http://testcomss01.playground.x-road.global
export XROAD_CLIENT_ID=PLAYGROUND/COM/1234567-8/TestClient
```
And then run
```shell
yarn start api
```
...Or alternatively, One-liner `export XROAD_BASE_PATH=http://testcomss01.playground.x-road.global;export XROAD_CLIENT_ID=PLAYGROUND/COM/1234567-8/TestClient;yarn start api`

## Running the Web app - api-catalogue
For the web app to be able to run, the GraphQL needs to be running
Running the **api-catalogue**
```shell
export CONTENTFUL_SPACE_ID=jtzqkuaxipis
export CONTENTFUL_ACCESS_TOKEN=N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0
yarn start api-catalogue
```
...Or alternatively, One-liner 
```shell
export CONTENTFUL_SPACE_ID=jtzqkuaxipis && export CONTENTFUL_ACCESS_TOKEN=N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0 && yarn start api-catalogue
```

## Quick start - api-catalog
For a quick start, when you have run postinstall and added data to elastic data 
you can start the web page like this:
1. Open three Git Bash shell windows from the root of this repository
   and insert into each windows the following commands.
2. Into each window paste one of these commands

Git Bash shell window 1 (Start elastic docker)
```shell
docker-compose -f ./libs/api-catalogue/elastic/elastic.yml up
```

Git Bash shell window 2 (Start graphql)
```shell
export XROAD_BASE_PATH=http://testcomss01.playground.x-road.global && export XROAD_CLIENT_ID=PLAYGROUND/COM/1234567-8/TestClient && yarn start api
```
Git Bash shell window 3 (Start api-catalogue)
```shell
export CONTENTFUL_SPACE_ID=jtzqkuaxipis && export CONTENTFUL_ACCESS_TOKEN=N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0 && yarn start api-catalogue
```

and open the app at http://localhost:4200



[Docker Desktop]:https://www.docker.com/products/docker-desktop
[Git Bash]:https://git-scm.com/downloads
[yarn]:ttps://yarnpkg.com/
[Wireframe]:https://www.figma.com/file/IQ006wy2vR1jIWJ6Uqwis5/Viskuausan?node-id=0%3A1
[Replository]:https://github.com/island-is/island.is/tree/master/apps/api-catalogue