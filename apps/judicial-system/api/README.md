# Getting started

## Initial setup

First, make sure you have docker, then run:

`yarn nx dev-services judicial-system-api`

Then run the migrations and seed the database:

`yarn nx run judicial-system-api:migrate`
`yarn nx run judicial-system-api:seed:all`

## Running locally

You can serve this service locally by running:

`yarn nx serve judicial-system-api --ssl`

To skip authentication at innskraning.island.is run:

`AUTH_USER=<national id> yarn nx serve judicial-system-api`

where `<national id>` is the national id of a known user.

Similarly, you can enable SMS notifications to an on-call judge by providing a password for the SMS service and
a judge mobile number:

`NOVA_PASSWORD=<SMS password> JUDGE_MOBILE_NUMBER=<judge mobile number>`

Finally, you can enable electronic signatures of judge rulings by providing a Dokobit access token:
`DOKOBIT_ACCESS_TOKEN=<Dokobit access token>`

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
