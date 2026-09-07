# RSK Rental Day Rate Client

This library was generated with [Nx](https://nx.dev).

Client for Skatturinn's `rentaldayrate-v1` service, used by the
`car-rental-dayrate-returns` and `car-rental-fee-category` application templates.

## Updating the OpenAPI document

Requires an X-Road proxy on `localhost:8081` (`yarn proxies xroad`) and `jq`.

```bash
yarn nx run clients-rental-day-rate:update-openapi-document
yarn nx run clients-rental-day-rate:codegen/backend-client
```

The fetch target writes to `_raw.tmp` and only moves it over `src/clientConfig.json`
once every patch below has succeeded, so a failed fetch cannot truncate the checked-in
spec. If the target does fail, delete the leftover `_raw.tmp`/`_.tmp` before retrying.

### Local patches applied to the fetched spec

The `update-openapi-document` target patches the document Skatturinn serves before it
lands in `src/clientConfig.json`:

1. **Path parameter name casing.** Skatturinn declares
   `POST /api/DayRate/entries/{EntityId}/deregister` with a path parameter named
   `entityId` while the path template says `{EntityId}`. The generator rejects the whole
   document over this (`Declared path parameter EntityId needs to be defined as a path
   parameter in path or operation level`). The patch renames any path parameter whose name
   differs from its `{placeholder}` only by case to match the template, across every
   operation — so the same upstream slip on another endpoint is handled without a new
   patch. It is a no-op when the names already agree.
2. `ProblemDetails.additionalProperties = false` — keeps the generator from emitting an
   index signature on the error model.
3. **Response schema for `GET /api/RentalDays/{EntityId}/periods/{Period}`.** Skatturinn
   declares this endpoint with `200 OK` and no `content`, which makes the generator emit
   `Promise<void>` and renders the endpoint unusable. The patch fills in
   `Array<RentalDaysEntry>`.

   > **This schema is our assumption, not Skatturinn's contract.** It was inferred from
   > `RentalDaysEntry` already being the nested shape on `DayRateEntry.rentalDaysEntries`.
   > Verify it against a real dev response before relying on it — a wrong `$ref` yields
   > silently-empty objects rather than a parse error.

   The patch only applies when `content` is absent, so it becomes a no-op automatically
   once Skatturinn declares the real schema. At that point delete the patch command.

Patch 3 fails the target loudly if the endpoint it targets has disappeared upstream, rather
than silently producing a spec that generates the wrong client.

## Running unit tests

Run `nx test clients-rental-day-rate` to execute the unit tests via [Jest](https://jestjs.io).
