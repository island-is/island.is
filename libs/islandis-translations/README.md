# Island.is Translations

Runtime bridge for fetching application translation namespaces from the island.is database (via direct DB access or HTTP to application-system-api).

Provides the `ApplicationTranslationProvider` contract, HTTP provider module, cache utilities, and namespace detection used by `@island.is/cms-translations` and `@island.is/application/api/core`.

## Running unit tests

Run `nx test islandis-translations` to execute the unit tests via [Jest](https://jestjs.io).
