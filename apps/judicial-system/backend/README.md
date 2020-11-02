# Getting started

## Initial setup

First, make sure you have docker, then run:

`yarn nx dev-services judicial-system-backend`

Then run the migrations and seed the database:

`yarn nx run judicial-system-backend:migrate`
`yarn nx run judicial-system-backend:seed:all`

## Running locally

You can serve this service locally by running:

`yarn nx serve judicial-system-backend --ssl`

To enable SMS notifications to an on-call judge provide a password for the SMS service and
a judge mobile number:

`NOVA_PASSWORD=<SMS password> JUDGE_MOBILE_NUMBER=<judge mobile number> yarn nx serve judicial-system-backend`

Finally, you can enable electronic signatures of judge rulings by providing a Dokobit access token:
`DOKOBIT_ACCESS_TOKEN=<Dokobit access token>`

## Graphql

Make sure you are serving the graphql client as well in order for you to make graphql calls to this service:

`yarn nx serve judicial-system-api`

## OpenApi and Swagger

Visit

`localhost:3344/api/swagger`

## Database changes

Migrations need to be created by hand.
