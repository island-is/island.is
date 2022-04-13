<!-- gitbook-navigation: "Driving License" -->

# Driving License Book Client

## About

This library implements a client to use Ökunámsbók's
Driver's license API through x-road

The client is generated from a copy of the openApi document provided in x-road.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-driving-license-book:update-openapi-document
```

### Regenerating the client:

```sh
yarn nx run clients-driving-license-book:schemas/external-openapi-generator
```

### Import into other NestJS modules

## Code owners and maintainers

- [Kosmos & Kaos](https://github.com/orgs/island-is/teams/kosmos-og-kaos/members)
