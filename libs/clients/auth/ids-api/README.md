# Auth IDS API Client

## About

This library provides a client for the [IdentityServer API](https://github.com/island-is/identity-server.web/blob/main/README.md).

## Usage

It is used by our [Auth GraphQL Domain](../../../../libs/api/domains/auth/README.md) to communicate with the IdentityServer API. See for instance [ConsentService](../../../../libs/api/domains/auth/src/lib/services/consent.service.ts).

When developing locally you would normally communicate with the IDS endpoints on dev, using an access token with the appropriate scope.

## Regenerating the client

To regenerate the client from the [OpenAPI](./src/clientConfig.yaml) specification, run

```sh
yarn nx run clients-auth-ids-api:schemas/external-openapi-generator
```
