# clients-directorate-of-equality-statistics

Client for the Directorate of Equality (Jafnréttisstofa) public statistics API, served by DMR over X-Road.

The API returns aggregate counts from the equal pay register for the Jafnlaunakerfi dashboard: companies by region, size, sector and certification status, validity rounds per company group, and national headcounts per status. It takes no parameters and needs no citizen token. Its own X-Road service keeps it apart from the authenticated application API (`@island.is/clients/directorate-of-equality`).

## Usage

```ts
import {
  DirectorateOfEqualityStatisticsClientModule,
  DirectorateOfEqualityStatisticsClientService,
} from '@island.is/clients/directorate-of-equality-statistics'
```

Register `DirectorateOfEqualityStatisticsClientConfig` in the app's `ConfigModule` load list.

`getStatistics()` keeps the response until the API's `expiresAt` (the next midnight UTC), so many charts on one page make a single request.

## Configuration

| Env var                                         | Description                                |
| ----------------------------------------------- | ------------------------------------------ |
| `XROAD_DIRECTORATE_OF_EQUALITY_STATISTICS_PATH` | X-Road service path for the statistics API |

## Updating the client

- `nx run clients-directorate-of-equality-statistics:update-openapi-document` (via X-Road)
- `nx run clients-directorate-of-equality-statistics:update-openapi-document-local` (from a DoE API running on port 5100)
- `nx run clients-directorate-of-equality-statistics:codegen/backend-client`

## Running unit tests

Run `nx test clients-directorate-of-equality-statistics` to execute the unit tests via [Jest](https://jestjs.io).
