# Web

## Quickstart

Ensure Docker is running, then execute the following command for the initial setup:

```bash
yarn dev-init web
```

To start the application:

```bash
yarn dev web
```

These commands simplify the setup described below.

## About

The web consolidates content from multiple sources and displays it in a user-friendly manner.

## URLs

- [Dev](https://beta.dev01.devland.is)
- [Staging](https://beta.staging01.devland.is)
- [Production](https://island.is)

## Getting Started

First, configure the API to fetch data from.

### Mock API (no server)

Add `API_MOCKS=true` to your `.env`, or `export API_MOCKS=true` to your `.env.secret`. Modify mock data in `libs/api/mocks`.

### Local API Server

The web depends on `cms` and `content-search` domains of the API, which require Elasticsearch. Choose your approach based on your task:

- **Working on `cms`/`content-search`:** Run Elasticsearch locally. Find instructions under [search-indexer dev-services](https://github.com/island-is/island.is/tree/main/apps/services/search-indexer/dev-services).
- **Accessing real data:** Use the Elasticsearch proxy server to access the dev environment's Elasticsearch instance. This uses fewer resources.

To access the Elasticsearch instance from the dev environment:

1. Login at [this AWS page](https://island-is.awsapps.com/start#/). Contact DevOps for access.
2. Copy env variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (image arrows 1,2,3).
3. Paste env variables into your terminal.
4. Run `./scripts/run-es-proxy.sh` from the island.is root.
5. Success is indicated by `Forwarding from 0.0.0.0:9200 -> 9200` in the terminal.

Caveats:

- **Docker/Podman must be installed and running.**
- **AWS env variables need refreshing every 8 hours.**

Start the API with:

```bash
yarn start api
```

Ensure env variables for `cms` and `content-search` are set:

- `CONTENTFUL_HOST=` Get from Contentful (depends on whether you use prod or preview tokens)
- `CONTENTFUL_ACCESS_TOKEN=` Get from Contentful or by running `yarn get-secrets api`
- `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=` Get from Contentful (used when generating models from Contentful in API)
- `ELASTIC_NODE=http://localhost:9200/`

### Start the Web Server

Run:

```bash
yarn start web
```

This starts a server on `localhost:4200`.

### Update Translation Namespaces in Contentful

```bash
yarn nx extract-strings web
```

Currently, only the `Custom Page` and `Connected Component` content types use the `Translation Namespace` content type for translations.

## Further Documentation

[Subpages](./docs/subpages.md) - Information on Layouts and Components for subpage creation.

## Code Owners and Maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
