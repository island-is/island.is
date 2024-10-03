# Web

## Quickstart

Ensure Docker is running, then execute the following command when running for the first time:

```bash
yarn dev-init web
```

To start the app:

```bash
yarn dev web
```

These commands are simply shorthands for the setup described below.

## About

The web consolidates content from multiple sources and displays it in a user-friendly manner.

## URLs

- [Dev](https://beta.dev01.devland.is)
- [Staging](https://beta.staging01.devland.is)
- [Production](https://island.is)

## Getting Started

First, configure which API to fetch data from.

### Mock API (No Server)

Add `API_MOCKS=true` to your `.env`, or `export API_MOCKS=true` to your `.env.secret` file.

You can tweak the mock data in `libs/api/mocks`.

### Local API Server

The web depends on the `cms` and `content-search` domains of the API, which in turn depend on Elasticsearch. Therefore, we need to have Elasticsearch running on our machine for these domains to function as expected. The recommended approach to running Elasticsearch on your machine depends on your objectives:

- **If you want to work on the `cms` or `content-search` domains**, such as adding models or altering Elasticsearch queries, it's recommended you run Elasticsearch locally. You can find further instructions on how to achieve this under the [search-indexer dev-services section.](https://docs.devland.is/apps/services/search-indexer/dev-services)

- **If you just want to run the API to access real data**, you can run the Elasticsearch proxy server. This provides access to the Elasticsearch instance of the dev environment (preferred, since the proxy uses fewer resources than the local instance of Elasticsearch).

To access the Elasticsearch instance from the dev environment:

1. Login at <https://island-is.awsapps.com/start#/> (Contact DevOps if you need access).
2. Copy environment variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (see image arrows 1, 2, 3).
3. Paste the environment variables into the terminal.
4. Run `./scripts/run-es-proxy.sh` from the `island.is` root directory.
5. Success is indicated by seeing `Forwarding from 0.0.0.0:9200 -> 9200` in the terminal.

**Caveats:**

- You need to have Docker/Podman installed and running.
- You have to refresh your AWS environment variables every 8 hours.

```bash
yarn start api
```

You must have environment variables for the `cms` and `content-search` domains for the website to work as expected.

These are:

- `CONTENTFUL_HOST=` - Obtain from Contentful (depends on whether you use production or preview tokens).
- `CONTENTFUL_ACCESS_TOKEN=` - Obtain from Contentful or by running `yarn get-secrets api`.
- `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=` - Obtain from Contentful (only used when generating models from Contentful in API).
- `ELASTIC_NODE=http://localhost:9200/`

### Start the Web Server

You can start the web server by running:

```bash
yarn start web
```

This starts a server on `localhost:4200`.

### To Update Translation Namespaces in Contentful

```bash
yarn nx extract-strings web
```

Currently, in this project, only the `Custom Page` content type utilizes the `Translation Namespace` content type for translations.

## Further Documentation

[Subpages](./docs/subpages.md) - Information on layouts and components used when creating subpages for the web.

## Code Owners and Maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
