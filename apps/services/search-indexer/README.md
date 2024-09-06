# Search Indexer

## About

The search indexer takes care of indexing content from Contentful into elasticsearch. You can run a local instance of elasticsearch using the `yarn dev-services services-search-indexer` see documentation under `./dev-services`.

## URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

## Getting started

**You must have access to Contentful for the indexer to work correctly**. To start the indexer server you run `yarn start services-search-indexer`. This starts a server on `localhost:3333`.

The indexer server currently has two endpoints:

- `/re-sync` indexes all supported entries into elasticsearch
- `/sync` indexes all supported entries **since last sync** into elasticsearch

## Nested entries

If a nested entry (like an accordion) gets updated, then for that change to be visible on the web, its page (an article) would need to be re-indexed.

This process can take a while, especially if a long time has passed since the last sync. That is why by default locally it's turned off, but if you'd like to turn it back on, you can set the `FORCE_SEARCH_INDEXER_TO_RESOLVE_NESTED_ENTRIES` environment variable to a truthy string value.

## Web Cache Invalidation

After an entry gets indexed it's not necessarily certain that it's web page will be updated immediately (due to caching). However there is a way to invalidate the cache via a query parameter. The search indexer has a process where after indexing it visits the corresponding web page with the given query parameter to refresh the cache. This cache invalidation process is turned off by default locally but you can turn it on by setting the `FORCE_CACHE_INVALIDATION_AFTER_INDEXING` environment variable to a truthy string value.

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)
