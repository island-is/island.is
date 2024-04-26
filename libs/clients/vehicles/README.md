# Vehicles Client

## About

This library implements a client to use Samgöngustofa's Mitt svæði API through x-road

The client is generated from a copy of the openApi document provided in x-road.

## Usage

The api/domain/vehicles uses this client to deliver data between.

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-vehicles:update-openapi-document
```

Caution:
It has been modified manually so be careful when overwriting.

### Regenerating the client:

This regenerates the client from clientConfig.json file.

```sh
yarn nx run clients-vehicles:codegen/backend-client
```

## Code owners and maintainers

- [Hugsmiðjan ](https://github.com/orgs/island-is/teams/hugsmidjan)
