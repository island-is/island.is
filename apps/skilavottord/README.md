# Car recycling - Skilavottorð

## About

This app is for users to mark their car for recycling and getting info on where to leave the car.

Recycling companies that receives the physical car can login to deregister it.

The recycling fund can then see a list of recycled cars.

## URLs

Dev: [https://skilavottord.dev01.devland.is](https://skilavottord.dev01.devland.is)

Staging: N/A

Prod: N/A

## Getting started

### Web

To run locally:

```bash
yarn start skilavottord-web
```

Navigate to:

- [localhost:4200/my-cars](http://localhost:4200/my-cars)
- [localhost:4200/deregister-vehicle](http://localhost:4200/deregister-vehicle)
- [localhost:4200/recycled-vehicles](http://localhost:4200/recycled-vehicles)

### Backend

First, make sure you have docker.

Then from the root folder go to

```bash
cd apps/skilavottord/ws
```

and run

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up -d
```

Then run migrations and seed the database:

```bash
yarn nx run skilavottord-ws:migrate:undo:all
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

Visit [localhost:3333/api/graphql](http://localhost:3333/api/graphql)

## Application

### User frontend

URL: [https://skilavottord.dev01.devland.is/my-cars](https://skilavottord.dev01.devland.is/my-cars)

This site shows a list of vehicles that a user own. The user can mark their car for recycling and get information on where to leave the car.
While the car is in the recycling process the page will show an update of the status accordingly.

### Company frontend

URL: [https://skilavottord.dev01.devland.is/deregister-vehicle](https://skilavottord.dev01.devland.is/deregister-vehicle)

If a user is registered as an employee of a recycling company, they can log in here to deregister vehicles that user's have previously prepared for recycling.

### Fund frontend

URL: [https://skilavottord.dev01.devland.is/recycled-vehicles](https://skilavottord.dev01.devland.is/deregister-vehicle)

If a user is registered as an employee of Fjársýsla ríkisins, they can log in here to see a list of all vehicles that has completed the process of being deregistered and recycled. This page also lists all available recycling companies.

## Integrations

- [Samgöngustofa](https://www.samgongustofa.is/): To fetch vehicle information and to deregister a vehicle.
- [Fjársýsla ríkisins](https://www.fjs.is/): To be able to initiate payment after vehicles have been recycled vehicles.

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte/members)
