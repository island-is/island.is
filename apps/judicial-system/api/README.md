# Getting started

## Initial setup

First, make sure you have docker, then run:

`yarn nx dev-services judicial-system-api`

Then run the migrations:

`yarn nx run judicial-system-api:migrate`

## Running locally

You can serve this service locally by running:

`yarn nx serve judicial-system-api --ssl`

To skip authentication at innskraning.island.is run:

`AUTH_USER=<national id> yarn nx serve judicial-system-api`

where `<national id>` is the national id of a known user.

## Graphql - not yet implemented

Make sure you are serving the graphql client as well in order for you to make graphql calls to this service:

`yarn nx serve api`

## OpenApi and Swagger

When making changes to the module code, run

`yarn nx generate-schema judicial-system-api`

to generate the code needed for openapi and swagger. Then you can visit

`localhost:3333/swagger`

## Database changes

Migrations need to be created by hand.
