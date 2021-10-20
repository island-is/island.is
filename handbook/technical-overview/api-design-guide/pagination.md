# Pagination

All services should support pagination from the start, even though the dataset is small. It is harder to add it later on as it would introduce breaking changes to the service interface.

Pagination should be implemented using _Cursor_ as a page reference. Cursor pagination solves the missing or duplication of data problems that the typical offset method has. Cursor pagination returns a cursor in the response, which is a pointer to a specific item in the dataset. This pointer needs to be based on an unique sequential field (or fields).

When implementing a cursor pagination the response object should follow this interface:

```typescript
interface GetReponse {
  data: T[]
  pageInfo: {
    hasPreviousPage: boolean
    hasNextPage: boolean
    startCursor: string
    endCursor: string
  }
  totalCount: number
}
```

The name of the data fields is arbitrary, and the developer is free to choose more descriptive name like in the following example:

```json
{
  "users":[
    { "id": "1001", "name": "Einar"},
    { "id": "1002", "name": "Erlendur"},
    { "id": "1003", "name": "Valdimar"},
  ],
  "pageInfo": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "startCursor": "aWQ6MTAwMQ=="
    "endCursor": "aWQ6MTAwMw==",
  },
  "totalCount": 25
}
```

The `totalCount` field indicates how many total items are available on the server.  
The `PageInfo` object is described in the following [section](#pageinfo).

## PageInfo

The `PageInfo` contains details about the pagination. It should follow the interface:

```typescript
interface PageInfo {
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor: string
  endCursor: string
}
```

The `hasPreviousPage` and `hasNextPage` are boolean flags to indicate if there exists more items before or after the current set of data received.
The `startCursor` and `endCursor` are `Base64` encoded strings. The client uses these values in following request to get previous or next page, see [query paramters](#pagination-query-parameters).

## Pagination Query parameters

For an API to support pagination it needs to support the following query parameters:

- `limit` - Limits the number of results in a request. The server should have a default value for this field.
- `before` - The client provides the value of `startCursor` from the previous response `pageInfo` to query the previous page of `limit` number of data items.
- `after` - The client provides the value of `endCursor` from the previous response to query the next page of `limit` number of data items.

The client only sends either `before` or `after` fields in a single request indicating if it wants the previous or next page of data items.

## Monorepo library

[Island.is monorepo](https://github.com/island-is/island.is) provides a [library](https://docs.devland.is/libs/nest/pagination) which contains DTO object for `PageInfo` and `Pagination` query objects. The library also contains an extension for paginated Sequelize queries.
