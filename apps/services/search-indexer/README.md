# Search Indexer

## About

The search indexer takes care of indexing content from Contentful into
Elasticsearch. You can run a local instance of Elasticsearch by running the
following (see the [relevant documentation](./dev-services)):

```bash
yarn dev-services services-search-indexer
```

## URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

## Getting started

> **You must have access to Contentful for the indexer to work correctly**.

To start the indexer server you run the following command to start a server on `localhost:3333`.

```bash
yarn start services-search-indexer
```

The indexer server currently has two endpoints:

- `/re-sync` indexes all supported entries into Elasticsearch
- `/sync` indexes all supported entries **since last sync** into Elasticsearch

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
