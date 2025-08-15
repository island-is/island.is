# Web Application

## Quickstart

Ensure docker is running, then run the following when running for the first time:

```bash
yarn dev-init web
```

To start the app:

```bash
yarn dev web
```

These commands are just shorthands for the setup described below.

## About

The web consolidates content from multiple sources and displays it in a user friendly way.

## URLs

- [Dev](https://beta.dev01.devland.is)
- [Staging](https://beta.staging01.devland.is)
- [Production](https://island.is)

## Getting started

First off: Configure which API to fetch data from.

### Mock API (no server)

Add `API_MOCKS=true` to your `.env`, or `export API_MOCKS=true` to your `.env.secret` file.

You can tweak the mock data in `libs/api/mocks`.

### Local API server

The web depends on the `cms` and `content-search` domains of the API these in turn depend on Elasticsearch.
Hence we have to have Elasticsearch running on our machine for these domains to function as expected.
The recommended approach to running Elasticsearch on your machine depends on what you want to work on:

If you want to work on the `cms` or `content-search` domains such as add models or alter Elasticsearch queries it's recommended you run Elasticsearch locally you can find further instructions on how to achieve this under [search-indexer dev-services section.](https://docs.devland.is/apps/services/search-indexer/dev-services)

If you just want to run the API to have access to real data you can run the Elasticsearch proxy server, this gives you access to the elasticsearch instance of the dev environment (this is prefered since the proxy uses less resources than the local instance of Elasticsearch).

To access elasticsearch instance from dev environment:

1. Login here https://island-is.awsapps.com/start#/ (Contact devops if you need access)
2. Copy env variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (image arrows 1,2,3)
3. Paste env variables into terminal
4. Run `./scripts/run-es-proxy.sh` from island.is root
5. You have success if you see `Forwarding from 0.0.0.0:9200 -> 9200` in terminal

Caveats:

- **You need to have docker/podman installed and running**
- **You have to refresh your AWS env variables every 8 hours**

```bash
yarn start api
```

You must have env variables for the `cms` and `content-search` domains for the website to work as expected.

These are:

- `CONTENTFUL_HOST=` - Get from Contentful (depends on whether you use prod or preview tokens)
- `CONTENTFUL_ACCESS_TOKEN=` - Get from Contentful or by running `yarn get-secrets api`
- `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=` - Get from Contentful (only used when generating models from Contentful in API)
  `ELASTIC_NODE=http://localhost:9200/`

### Start the web server

You can start the web server by running:

```bash
yarn start web
```

This starts a server on `localhost:4200`

### To update a translation namespace in Contentful

```bash
yarn ts-node -P libs/localization/tsconfig.lib.json libs/localization/scripts/extract 'relative/path/to/file/containing/translations'
```

Currently, in this project, only the `Custom Page` and `Connected Component` content types utilizes the `Translation Namespace` content type for translations

## Payment confirmation flow

apps/web/pages/api/payments/event-callback.ts contains a route that gets called when a payment flow event update occurs.

To test out this functionality locally you'll need the following environment variables:

- `PAYMENTS_WEB_URL`: Base URL for the payments service
- `WEB_PAYMENT_CONFIRMATION_SECRET`: Secret for payment confirmation validation
- `LANDSPITALI_PAYMENT_FLOW_EVENT_CALLBACK_URL`: Callback URL for Landspitali payment events (Only if you are testing the "Landspítali" payment flow specifically, more environment variables might be added in the future if there'll be more login-less payments)

### Redis Configuration for JTI Caching

The application uses Redis to store JWT IDs (JTIs) to prevent replay attacks in payment callbacks. If you want to test things out locally you can run the shared redis-cluster and then set the following env variable:

- `REDIS_URL_NODE_01`: localhost:7010

## Further Documentation

[Subpages](./docs/subpages.md) - Information on Layouts and Components used when
creating subpages for the web.

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
