## Auth IDS API Client

### Overview

This library provides a client for the [IdentityServer API](https://github.com/island-is/identity-server.web/blob/main/README.md).

### Usage

The Auth IDS API Client is utilized by our [Auth GraphQL Domain](../../../../libs/api/domains/auth/README.md) to communicate with the IdentityServer API. A specific example of this interaction can be found in the [ConsentService](../../../../libs/api/domains/auth/src/lib/services/consent.service.ts).

During local development, communication with the IDS endpoints in the development environment often requires an access token with the correct scope.

### Regenerating the Client

To regenerate the client from the OpenAPI specification defined in [clientConfig.yaml](./src/clientConfig.yaml), execute the following command:

```sh
yarn nx run clients-auth-ids-api:codegen/backend-client
```