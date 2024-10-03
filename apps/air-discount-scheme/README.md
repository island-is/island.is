# Air Discount Scheme

## About

Generates discount codes for booking eligible domestic flights. Eligibility criteria:

- Legal domicile in specific towns outside the capital. Postal codes from Þjóðskrá are used for validation.

## URLs

- [Dev](https://loftbru.dev01.devland.is)
- [Staging](https://loftbru.staging01.devland.is)
- [Production](https://loftbru.island.is)

## API

The API allows airlines to verify discount code validity and access basic user booking info. Authorized airlines: `Icelandair`, `Ernir`, and `Norlandair`. Flights historically booked through `Icelandair` for `Norlandair` are marked with `Icelandair` but have a cooperation field with `Norlandair`.

[Swagger API](https://loftbru.dev01.devland.is/api/swagger)

```bash
yarn start air-discount-scheme-api
```

## Backend

The admin interface provides an overview of registered bookings, primarily for Vegagerðin.

[Admin](https://loftbru.dev01.devland.is/admin)

```bash
yarn start air-discount-scheme-backend
```

## Web

The user interface includes initiative details, legal terms, and a tool for obtaining discount codes.

[Dev](https://loftbru.dev01.devland.is)

```bash
yarn start air-discount-scheme-web
```

## Integrations

- [Þjóðskrá](https://skra.is): Used to verify legal domicile, provide airlines with basic personal info, and retrieve discount codes for related children.

## Development

To start developing:

1. Fetch environment secrets:

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

3. Start the front end:

```bash
yarn start air-discount-scheme-web
```

4. Start the GraphQL API:

```bash
yarn start air-discount-scheme-api
```

5. Start the backend API:

```bash
yarn start air-discount-scheme-backend
```

6. Verify Contentful and AWS:

Log in at <https://island-is.awsapps.com/start#/> (Contact devops for access). Copy environment variables as described in [the documentation](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting), then paste into terminal. Execute `./scripts/run-es-proxy.sh` from the island.is root directory. Success is indicated by `Forwarding from 0.0.0.0:9200 -> 9200` in terminal output.

Visit [localhost:4200](http://localhost:4200) for the website or [localhost:4248/api/swagger/](http://localhost:4248/api/swagger/) for the airline API.

### Admin

To access the Admin UI, add your Icelandic National ID to the `DEVELOPERS` environment variable in `.env.secret` and restart the API.

```bash
export DEVELOPERS=1234567890
```

## Shortcuts

Due to time constraints, certain shortcuts were necessary:

- Authentication is basic; using static API keys as IDP was under development.
- The deployment pipeline is separate from the main island.is pipeline.
- The GraphQL API is independent of island.is's main GraphQL API.

## Project Owner

- [Vegagerðin](http://www.vegagerdin.is)

## Code Owners and Maintainers

- [Brian - @barabrian](https://github.com/barabrian)
- [Davíð Guðni - @dabbeg](https://github.com/dabbeg)
- [Darri Steinn - @darrikonn](https://github.com/darrikonn)