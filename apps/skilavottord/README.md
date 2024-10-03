# Car Recycling - Skilavottorð

## About

This app allows users to mark their car for recycling and provides information on where to bring the car. Recycling companies that receive the physical car can log in to deregister it. The recycling fund can then view a list of recycled cars.

## URLs

Refer to the role description further down.

### Development Environment

- [Dev - Company Role](https://beta.dev01.devland.is/app/skilavottord/deregister-vehicle)
- [Dev - Fund Role](https://beta.dev01.devland.is/app/skilavottord/recycled-vehicles)

### Staging Environment

- [Staging - Company Role](https://beta.staging01.devland.is/app/skilavottord/deregister-vehicle)
- [Staging - Fund Role](https://beta.staging01.devland.is/app/skilavottord/recycled-vehicles)

### Production Environment

- [Prod - Company Role](https://island.is/app/skilavottord/deregister-vehicle)
- [Prod - Fund Role](https://island.is/app/skilavottord/recycled-vehicles)

## Getting Started

### Setup

Use the `yarn get-secrets skilavottord-ws` command to fetch environment secret variables. Additionally, add the following environment variable to `.env.secret` in the project's root:

```bash
export NEXTAUTH_URL=http://localhost:4200/app/skilavottord/api/auth
```

### Running the Web Application Locally

To start the web application locally, execute:

```bash
yarn start skilavottord-web
```

Then navigate to:

- [Deregister Vehicle](http://localhost:4200/app/skilavottord/deregister-vehicle)
- [Recycled Vehicles](http://localhost:4200/app/skilavottord/recycled-vehicles)

### Running the Backend Locally

Ensure you have Docker installed. From the root folder, execute:

```bash
cd apps/skilavottord/ws
```

Run Docker Compose:

```bash
docker compose up
```

Run the database migrations and seed the database:

```bash
yarn nx run skilavottord-ws:migrate/undo
yarn nx run skilavottord-ws:migrate
yarn nx run skilavottord-ws:seed:all
```

To start the backend application locally, run:

```bash
yarn start skilavottord-ws
```

### GraphQL Playground

Access the GraphQL playground at [localhost:3333/app/skilavottord/api/graphql](http://localhost:3333/app/skilavottord/api/graphql)

## Application

### Company Frontend

URL:
[https://island.is/app/skilavottord/deregister-vehicle](https://island.is/app/skilavottord/deregister-vehicle)

Employees of recycling companies can log in here to deregister vehicles that citizens have marked for recycling.

### Fund Frontend

URL:
[https://island.is/app/skilavottord/recycled-vehicles](https://island.is/app/skilavottord/recycled-vehicles)

Employees of Fjársýsla ríkisins can log in here to view a list of all vehicles that have completed the recycling process. This page also displays all available recycling companies.

## Integrations

- [Samgöngustofa](https://www.samgongustofa.is/): Used for fetching vehicle information and deregistering vehicles.
- [Fjársýsla ríkisins](https://www.fjs.is/): Facilitates payment initiation after vehicle recycling.

## Code Owners and Maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte/members)
- [Vice Versa](https://github.com/orgs/island-is/teams/vice-versa/members)