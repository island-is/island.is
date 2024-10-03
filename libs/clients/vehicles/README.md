# Vehicles Client

## Overview

This library provides a client to access Samgöngustofa's Mitt svæði API via x-road. The client is generated from an OpenAPI document copy available in x-road.

## Usage

The `api/domain/vehicles` utilizes this client for data transfer.

### Update OpenAPI Definition (clientConfig.json)

```sh
yarn nx run clients-vehicles:update-openapi-document
```

Note: The file has manual modifications, be cautious when overwriting.

### Regenerate Client

Regenerate the client from the `clientConfig.json` file.

```sh
yarn nx run clients-vehicles:codegen/backend-client
```

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
