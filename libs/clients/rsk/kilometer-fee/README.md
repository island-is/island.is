# clients-rsk-kilometer-fee

Client for Skatturinn's kílómetragjald service (`Kilometragjald-kilometer-fee` over X-Road): the estimated and confirmed kilometer fee per month for one vehicle, and an Excel export of the same data.

## The OpenAPI document is hand-written

`src/clientConfig.json` is the contract island.is has proposed to Skatturinn. Their published spec (`getOpenAPI?serviceCode=Kilometragjald-kilometer-fee`) has no response schemas, so there is no `update-openapi-document` target. Until Skatturinn implements this contract, consumers use mock data. When they do, replace this file with their spec and add the target back.

## Auth

The user's token is exchanged (`autoAuth.tokenExchange`) and forwarded. Skatturinn returns 404 for a vehicle the user does not own and 401 for an invalid token. No scope is required yet.

## Codegen

`yarn nx run clients-rsk-kilometer-fee:codegen/backend-client`
