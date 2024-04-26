# Syslumenn Client

## About

This library implements a client to use Syslumenn's API

The client is generated from a copy of the openApi document provided by Syslumenn.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-syslumenn:update-openapi-document
```

### Regenerating the client:

```sh
yarn nx run clients-syslumenn:codegen/backend-client
```

### Import into other NestJS modules

## Code owners and maintainers

- [Júní](https://github.com/orgs/island-is/teams/juni/members)
- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
