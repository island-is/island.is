# Car Recycling - Skilavottorð

## About

This app is for users to mark their car for recycling and getting info about
where to leave the car.

Recycling companies that receives the physical car can login to deregister it.

The recycling fund can then see a list of recycled cars.

## URLs

See role description further down.

### Dev

- [Dev - role: company](https://beta.dev01.devland.is/app/skilavottord/deregister-vehicle)
- [Dev - role: fund/municipality](https://beta.dev01.devland.is/app/skilavottord/recycled-vehicles)

### Staging

- [Staging - role: company](https://beta.staging01.devland.is/app/skilavottord/deregister-vehicle)
- [Staging - role: fund/municipality](https://beta.staging01.devland.is/app/skilavottord/recycled-vehicles)

### Prod

- [Prod - role: company](https://island.is/app/skilavottord/deregister-vehicle)
- [Prod - role: fund/municipality](https://island.is/app/skilavottord/recycled-vehicles)

## Getting started

### Setup

Please fetch environment secret variables using the
`yarn get-secrets skilavottord-ws` command.

Additionally add the following environment variables to `.env.secret` in the
project's root:

```bash
export NEXTAUTH_URL=http://localhost:4200/app/skilavottord/api/auth
```

### Web

To run locally:

```bash
yarn start skilavottord-web
```

Navigate to:

- [localhost:4200/app/skilavottord/deregister-vehicle](http://localhost:4200/app/skilavottord/deregister-vehicle)
- [localhost:4200/app/skilavottord/recycled-vehicles](http://localhost:4200/app/skilavottord/recycled-vehicles)

### Backend

First, make sure you have docker.

Then from the root folder go to

```bash
cd apps/skilavottord/ws
```

and run

```bash
docker compose up
```

Then run migrations and seed the database:

```bash
yarn nx run skilavottord-ws:migrate/undo
```

```bash
yarn nx run skilavottord-ws:migrate
```

```bash
yarn nx run skilavottord-ws:seed:all
```

To start the application locally run:

```bash
yarn start skilavottord-ws
```

### GraphQL playground

Visit
[localhost:3333/app/skilavottord/api/graphql](http://localhost:3333/app/skilavottord/api/graphql)

## Application

### Company frontend

URL:
[https://island.is/app/skilavottord/deregister-vehicle](https://island.is/app/skilavottord/deregister-vehicle)

If users are registered as an employee of a recycling company, they can log in
here to deregister vehicles that citizens have marked for recycling.

### Fund/municipality frontend

URL:
[https://island.is/app/skilavottord/recycled-vehicles](https://island.is/app/skilavottord/recycled-vehicles)

If users are registered as an employee of Fjársýsla ríkisins, they can log in
here to see a list of all vehicles that has completed the process of being
deregistered and recycled.

This page also lists all available recycling companies.

## Integrations

- [Samgöngustofa](https://www.samgongustofa.is/): To fetch vehicle information
  and to deregister vehicles.
- [Fjársýsla ríkisins](https://www.fjs.is/): To be able to initiate payment
  after vehicles have been recycled.

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte/members)
- [Vice Versa](https://github.com/orgs/island-is/teams/vice-versa/members)
