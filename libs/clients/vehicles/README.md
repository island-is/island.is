```markdown
# Vehicles Client

## Overview

This library provides a client to interact with Samgöngustofa's Mitt Svæði API via X-Road. The client is auto-generated from an OpenAPI document sourced from X-Road.

## Usage

The `api/domain/vehicles` module utilizes this client to facilitate data exchange.

## Update Instructions

### Updating OpenAPI Definition (`clientConfig.json`)

To update the OpenAPI definition, run:

```sh
yarn nx run clients-vehicles:update-openapi-document
```

**Note:** Since this file may contain manual modifications, exercise caution when overwriting.

### Regenerating the Client

To regenerate the client from the `clientConfig.json` file, execute:

```sh
yarn nx run clients-vehicles:codegen/backend-client
```

## Contributors

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
```