# clients-district-commissioners-home-lodgings

Client for Sýslumenn's home lodging (heimagisting) registrations of the
authenticated user.

- **Endpoint:** `GET /api/IslandISHeimagistingar` on the `IslandMinarSidur`
  X-Road service (`XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH`, e.g.
  `IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur`).
- **Auth:** token exchange of the user's token. Sýslumenn have no dedicated
  home lodging scope, so the client uses `@syslumenn.is/staediskort` like the
  other `IslandMinarSidur` clients.

## OpenAPI document

`src/clientConfig.json` is generated from the upstream `Syslumenn-Protected/swagger`
document and is not edited by hand. The `update-openapi-document` target filters
it down to `/api/IslandISHeimagistingar` and the schemas it references, since the
rest of that service is covered by `clients-district-commissioners-licenses` and
`clients-syslumenn`. To refresh it, start the X-Road proxy
(`./scripts/run-xroad-proxy.sh`) and run
`yarn nx run clients-district-commissioners-home-lodgings:update-openapi-document`,
then `codegen/backend-client`.

## Testing locally

Gervimaður Færeyja (`0101302399`, phone `010-2399` on the dev identity server)
has one home lodging, `HG00016707`, in IS-DEV.

## Running unit tests

Run `nx test clients-district-commissioners-home-lodgings` to execute the unit
tests via [Jest](https://jestjs.io).
