# Form System

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init services-form-system-api
```

To start the app:

```bash
yarn dev services-form-system-api
```

These commands are just shorthands for the setup described below.

## URLs

- [Dev](https://beta.dev01.devland.is/form/<slug>)
- [Staging](https://beta.staging01.devland.is/form/<slug>)
- [Production](https://island.is/form/<slug>)

## API

### Initial setup

First, make sure you have docker, then run:

```bash
yarn dev-services services-form-system-api
```

Then run the migrations:

```bash
yarn nx run services-form-system-api:migrate
```

Fetch secrets

```bash
AWS_PROFILE=islandis-dev yarn get-secrets services-form-system-api
```

### Running locally

## Create form type

You need to run the admin portal

```bash
yarn start api
yarn dev services-form-system-api
yarn dev portals-admin
```

Open localhost:4200/stjornbord -> Log in as Gervimaður Færeyjar as 65°Artic -> go to "Umsóknarsmiður" -> Create new form type -> Select Zendesk under "slóðir" -> Give the form type the status Published

## Create / view form application

You can serve this service locally by running:

```bash
yarn start api
yarn dev services-form-system-api
yarn dev form-system-web
```

Open localhost:4242/form/<slug>

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
