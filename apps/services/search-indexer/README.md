# Search Indexer

## About

The search indexer is responsible for indexing content from Contentful into Elasticsearch. You can run a local instance of Elasticsearch using the command `yarn dev-services services-search-indexer`. Refer to the documentation under `./dev-services` for more details.

## URLs

- Dev: N/A
- Staging: N/A
- Production: N/A

## Getting Started

**Note:** You must have access to Contentful for the indexer to function correctly. To start the indexer server, run `yarn start services-search-indexer`. This will start a server on `localhost:3333`.

The indexer server currently provides two endpoints:

- `/re-sync`: Indexes all supported entries into Elasticsearch.
- `/sync`: Indexes all supported entries **since the last sync** into Elasticsearch.

## Nested Entries

If a nested entry (such as an accordion) is updated, the page containing it (e.g., an article) needs to be re-indexed for the change to be visible on the web.

This process may take some time, especially if a long period has passed since the last sync. Locally, this feature is disabled by default. To enable it, set the `FORCE_SEARCH_INDEXER_TO_RESOLVE_NESTED_ENTRIES` environment variable to a truthy string value.

## Web Cache Invalidation

After an entry is indexed, the corresponding web page may not update immediately due to caching. However, there is a mechanism to invalidate the cache using a query parameter. The search indexer executes a process where, after indexing, it visits the corresponding web page with the specified query parameter to refresh the cache. This cache invalidation process is disabled by default locally. To enable it, set the `FORCE_CACHE_INVALIDATION_AFTER_INDEXING` environment variable to a truthy string value.

## Code Owners and Maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)