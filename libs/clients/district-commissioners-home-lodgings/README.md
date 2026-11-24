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

`src/clientConfig.json` is maintained by hand. The upstream document at
`Syslumenn-Protected/swagger` describes the response of
`IslandISHeimagistingar_Get` as `EstatePages`, but the service actually returns
an array of home lodgings:

```json
[
  {
    "id": "HG00016707",
    "years": [{ "year": "2024", "returned": false }],
    "address": "Gervistaðir",
    "postalCode": "101 Reykjavík",
    "apartmentNumber": "010101",
    "guests": "3",
    "rooms": "1"
  }
]
```

Replace the document with the upstream one once it is fixed.

## Testing locally

Gervimaður Færeyja (`0101302399`, phone `010-2399` on the dev identity server)
has one home lodging, `HG00016707`, in IS-DEV.

## Running unit tests

Run `nx test clients-district-commissioners-home-lodgings` to execute the unit
tests via [Jest](https://jestjs.io).
