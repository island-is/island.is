# Getting started

## Initial setup

First, make sure you have docker, then run:

`yarn nx dev-services application-system-api`

Then run the migrations:

`yarn nx run application-system-api:migrate`

## Running locally

You can serve this service locally by running:

`yarn nx serve application-system-api`

## Graphql

Make sure you are serving the graphql client as well in order for you to make graphql calls to this service:

`yarn nx serve api`

## OpenApi and Swagger

When making changes to the module code, run

`yarn nx generate-schema application-system-api`

to generate the code needed for openapi and swagger. Then you can visit

`localhost:3333/swagger`

In order to update the graphql schema as well, run

`yarn nx codegen api-domains-application`
