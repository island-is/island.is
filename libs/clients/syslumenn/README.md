# Syslumenn Client

## Overview

This library provides a client for interfacing with the Syslumenn API. The client is generated from the Syslumenn's OpenAPI specification.

## Usage

### Update OpenAPI Definition

To update the OpenAPI definition (`clientConfig.json`), run:

```bash
yarn nx run clients-syslumenn:update-openapi-document
```

### Regenerate the Client

To regenerate the client, execute:

```bash
yarn nx run clients-syslumenn:codegen/backend-client
```

### Integration with NestJS

Import the client into your NestJS modules as needed.

## Code Owners and Maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
