# Air Discount Scheme - Loftbrú

## About

Generates discount codes that can be used for booking domestic flights online.

There are certain precondition to be eligible for a discount. They are:

- The person's legal domicile needs to be in a predefined set of towns outside
  the capital (We fetch postal codes from Þjóðskrá to validate if user is
  eligible).

## Project entrypoints

Dev: [https://loftbru.dev01.devland.is](https://loftbru.dev01.devland.is)

Staging: [https://loftbru.staging01.devland.is](https://loftbru.staging01.devland.is)

Production: [https://loftbru.island.is](https://loftbru.island.is)

### User Frontend

The user frontend has information about the initiative, legal terms and a way
for users to get their discount codes.

URL: [https://loftbru.dev01.devland.is](https://loftbru.dev01.devland.is)

### Admin Frontend

The admin frontend has a view over the bookings that have been registered in
the system. This is mainly for Vegagerðin.

URL: [https://loftbru.dev01.devland.is/admin](https://loftbru.dev01.devland.is/admin)

### Public API

The API is used by the airlines to verify the discount code validity and get
basic booking info about the user.

The airlines that have access to this api are `Air Iceland Connect` and `Ernir`.
Though some flights created by `Air Iceland Connect` maybe booked for
`Norlandair` as it uses the same booking site as `Air Iceland Connect`.

URL: [https://loftbru.dev01.devland.is/api/swagger/](https://loftbru.dev01.devland.is/api/swagger/)

## Integrations

- [Þjóðskrá](https://skra.is): To be able to verify the persons legal domicile,
  give the airlines basic information about the person and fetch a persons
  relations to show the discount codes for related children.

## Development

To get started developing this project, go ahead and:

1. Fetch the environment secrets: `yarn env-secrets air-discount-scheme --reset`
2. Start the resources with docker-compose: `docker-compose -f apps/air-discount-scheme/backend/docker-compose.base.yml -f apps/air-discount-scheme/backend/docker-compose.dev.yml up`
3. Start the front end: `yarn start air-discount-scheme-web`
4. Start the graphql api: `yarn start air-discount-scheme-api`
5. Start the backend api: `yarn start air-discount-scheme-backend`

Navigate to [localhost:4200](http://localhost:4200) for the website or
[localhost:4248/api/swagger/](http://localhost:4248/api/swagger/) for the airline api.

## Shortcuts

Because of the short timeline this assignment had, there were few shortcuts taken
that can be improved upon:

- The authentication is pretty primitive, the IDP is still in development at
  the time of this writing so we needed to use static api keys.
- The deployment pipeline is outside of the islandis main pipeline.
- The graphql api is separate of the main graphql api of islandis.

## Owner

Vegagerðin owns this system.

## Maintainers

barabrian - Brian

dabbeg - Davíð Guðni

darrikonn - Darri Steinn
