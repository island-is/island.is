# Air Discount Scheme

## About

The Air Discount Scheme generates discount codes that can be used for booking domestic flights online. To qualify for these discounts, individuals must meet specific eligibility criteria:

- The individual's legal domicile must be in a designated set of towns outside the capital. Postal codes fetched from Þjóðskrá validate a user's eligibility.

## Accessible URLs

- [Development](https://loftbru.dev01.devland.is)
- [Staging](https://loftbru.staging01.devland.is)
- [Production](https://loftbru.island.is)

## API

This API is used by airlines to verify the validity of discount codes and to retrieve basic booking information about the user. The following airlines have access to this API:

- `Icelandair`
- `Ernir`
- `Norlandair`

Occasionally, flights for `Norlandair` are booked through `Icelandair`. Such flights are recorded under the `Icelandair` airline but include a cooperation field indicating `Norlandair`.

[Swagger API Documentation](https://loftbru.dev01.devland.is/api/swagger)

```bash
yarn start air-discount-scheme-api
```

## Backend

The admin frontend provides a view of the bookings registered within the system, primarily for Vegagerðin.

[Admin Interface](https://loftbru.dev01.devland.is/admin)

```bash
yarn start air-discount-scheme-backend
```

## Web Interface

The user-facing frontend shares details about the initiative, legal terms, and a way for users to acquire their discount codes.

[Development Interface](https://loftbru.dev01.devland.is)

```bash
yarn start air-discount-scheme-web
```

## Integrations

- [Þjóðskrá](https://skra.is): Provides the verification of legal domicile, essential user information for airlines, and the ability to fetch related children’s discount codes.

## Development Guide

To start developing this project:

1. Fetch the environment secrets:

```bash
yarn get-secrets air-discount-scheme-api
yarn get-secrets air-discount-scheme-backend
yarn get-secrets air-discount-scheme-web
```

2. Start resources with Docker Compose and migrate/seed the database:

```bash
docker compose -f apps/air-discount-scheme/backend/docker-compose.yml up
```

```bash
yarn nx run air-discount-scheme-backend:migrate
yarn nx run air-discount-scheme-backend:seed
```

3. Start the frontend:

```bash
yarn start air-discount-scheme-web
```

4. Launch the GraphQL API:

```bash
yarn start air-discount-scheme-api
```

5. Start the backend API:

```bash
yarn start air-discount-scheme-backend
```

6. Check Contentful and AWS:

Log in [here](https://island-is.awsapps.com/start#!/) (Contact DevOps for access if needed).
Copy environment variables as per instructions [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting).
Paste the environment variables into the terminal.
Execute `./scripts/run-es-proxy.sh` from the island.is root.
Success is indicated by `Forwarding from 0.0.0.0:9200 -> 9200` in the terminal.

Visit [localhost:4200](http://localhost:4200) for the user interface or [localhost:4248/api/swagger/](http://localhost:4248/api/swagger/) for the airline API.

### Admin Access

To gain access to the Admin UI, include your Icelandic National ID in the `DEVELOPERS` environment variable (comma-separated) in the `.env.secret` file and restart the API:

```bash
export DEVELOPERS=1234567890
```

## Shortcuts

Several shortcuts were taken due to tight deadlines, some of which can be improved:

- Authentication is rudimentary. Since the IDP was under development during creation, static API keys were used.
- The deployment pipeline is separate from the primary island.is pipeline.
- The GraphQL API operates separately from island.is's main GraphQL API.

## Project Owner

- [Vegagerðin](http://www.vegagerdin.is)

## Code Owners and Maintainers

- [Brian - @barabrian](https://github.com/barabrian)
- [Davíð Guðni - @dabbeg](https://github.com/dabbeg)
- [Darri Steinn - @darrikonn](https://github.com/darrikonn)
