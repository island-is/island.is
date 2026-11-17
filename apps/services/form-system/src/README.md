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

Open localhost:4200/stjornbord -> Log in as Gervimaður Færeyjar as 65° Arctic -> go to "Umsóknasmiður" -> Create new form type -> Select Zendesk under "slóðir" -> Give the form type the status Published

## Create / view form application

You can serve this service locally by running:

```bash
yarn start api
yarn dev services-form-system-api
yarn dev form-system-web
```

Open localhost:4242/form/<slug>

## Zendesk routing

Local environments (`name` unset or `local`) and dev deployments (`name=dev`)
always send applications to the configured Zendesk sandbox, including applications
for published forms. Stored production tenants and brand IDs are ignored there,
even when `NODE_ENV=production`.

## Application PDFs

Application PDFs display the organization's stored `logo.is` in the top-right
header on the first page only, regardless of the PDF language. Content starts below the
header and footer positions are unchanged. Logos are loaded from Contentful as
PNG images; organizations without an Icelandic logo produce PDFs without one.
Logo download failures are logged and do not block user or X-Road PDF downloads.

## Code owners and maintainers

- [Advania](https://github.com/orgs/island-is/teams/advania/members)
