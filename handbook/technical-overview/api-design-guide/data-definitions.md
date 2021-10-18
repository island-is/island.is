# Data Definitions and Standards

## Text encoding

APIs should represent all texts in the [UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoding.

## JSON

Primitive values MUST be serialized to JSON following the rules of [RFC8259](https://tools.ietf.org/html/rfc8259) and, as stated in the standard, JSON text MUST be encoded using UTF-8 [RFC3629](https://tools.ietf.org/html/rfc3629).

JSON can represent four primitive types _strings_, _numbers_, _booleans_, and _null_ and two structured types _objects_ and _arrays_. Concepts like [Date and Time](data-definitions.md#date-and-time) need to be represented using these types.

## Data transfer objects

Data transfer objects, or DTOs, are objects used to wrap resource definitions in request/response objects along with additional information.

In a response body, you should return a JSON object, not an array, as a top level data structure to support future extensibility. This would allow you to extend your response and, for example, add a server side pagination attribute.

**Bad response body**

```text
[
  { "id": "1", "name": "Einar"   },
  { "id": "2", "name": "Erlendur"},
  { "id": "3", "name": "Valdimar"}
]
```

**Good response body**

```text
{
  "users":[
    { "id": "1001", "name": "Einar"},
    { "id": "1002", "name": "Erlendur"},
    { "id": "1003", "name": "Valdimar"},
  ]
}
```

## Pagination

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

### PageInfo

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

### Pagination Query parameters

For an API to support pagination it needs to support the following query parameters:

- `limit` - Limits the number of results in a request. The server should have a default value for this field.
- `before` - The client provides the value of `startCursor` from the previous response `pageInfo` to query the previous page of `limit` number of data items.
- `after` - The client provides the value of `endCursor` from the previous response toquery the next page of `limit` number of data items.

The client only sends either `before` or `after` fields in a single request indicating if it wants the previous or next page of data items.

### Monorepo library support

[Island.is monorepo](https://github.com/island-is/island.is) provides a [helper library](https://docs.devland.is/libs/nest/pagination) which contains DTO object for `PageInfo` and `Pagination` query objects. The library also contains an extension for paginated Sequelize queries.

## National identifier

Icelandic individuals are uniquely identified by a national identifier called `kennitala`. When referring to this identifier in URIs, requests, or responses, APIs should use the name `nationalId`. Its value is usually represented to users in the form `######-####` but APIs should use the form `##########` at all times.

## Language and currency

- **Languages** - When specifying a language please use the [ISO-639-1](https://www.iso.org/standard/22109.html) (two letter) standard. See: [639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
- **Currencies** - When specifying currency codes please use the [ISO-4217](https://www.iso.org/iso-4217-currency-codes.html) standard. See: [4217 codes](https://en.wikipedia.org/wiki/ISO_4217#Active_codes).
  - **Amount** - Use the format `[0-9]+(.[0-9]+)?` to represent an amount. Separate amount and currency in different fields. Example amount: `1250.23`.

## Date and time

Date and time values should be represented in a string, as described in the [RFC3339](https://tools.ietf.org/html/rfc3339) proposed standard. The standard defines a profile of [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) for use in Internet protocols. See: [Section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6) for Date/Time Format.

### Summary for date and time

Date and time should be represented as a string using the format `yyyy-MM-ddThh:mm:ss.sssZ`. Where

- **yyyy** represents year, (four-digits).
- **MM** represents month, (two-digits _01 - 12_).
- **dd** represents day of month, (two-digits _01 - 31_).
- **hh** represents hour, (two digits _00 - 24_).
- **mm** represents minute, (two digits _00 - 59_).
- **ss** represents second, (two digits _00 - 59_).
- **sss** represents a decimal fraction of a second, (one or more digits).
- **Z** represents a time zone offset specified as `Z` (for [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)) or either `+` or `-` followed by a time expression `hh:mm`.

Icelandic local time can be represented with `Z` because Iceland follows the [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) +00:00 all year round, which is the same as [GMT](https://en.wikipedia.org/wiki/Greenwich_Mean_Time).

Examples:

- `1985-04-12T23:20:50.52Z` represents 20 minutes and 50.52 seconds after the 23rd hour of April 12th, 1985 in [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).
- `1996-12-19T16:39:57-08:00` represents 39 minutes and 57 seconds after the 16th hour of December 19th, 1996 with an offset of -08:00 from [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (Pacific Standard Time). Note that this is equivalent to `1996-12-20T00:39:57Z` in UTC.

## Timestamp data

All returned data should contain the field `createdTimestamp` and it's value should be the [date and time](data-definitions.md#date-and-time) when the data was created. This is important because of different caching rules and different viewpoints on when data should be considered obsolete.
