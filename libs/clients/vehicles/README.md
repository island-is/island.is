<!-- gitbook-navigation: "Driving License" -->

# Vehicles Client

## About

This library implements a client to use Samgöngustofa's Mitt svæði API through x-road

The client is generated from a copy of the openApi document provided in x-road.

## Usage

### Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-vehicles:update-openapi-document
```

### Regenerating the client:

```sh
yarn nx run clients-vehicles:schemas/external-openapi-generator
```

### Import into other NestJS modules

## Code owners and maintainers

- [Hugsmiðjan ](https://github.com/orgs/island-is/teams/hugsmidjan)
