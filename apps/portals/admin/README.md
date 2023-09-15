# Admin Portal

## About

The admin portal allows government organisations to manage everything they need on island.is.

It shares technical architecture and module system with the [service portal](../../service-portal/README.md).

## URLs

- [Development] (http://localhost:4201)
- [Dev](https://beta.dev01.devland.is/stjornbord)
- [Staging](https://beta.staging01.devland.is/stjornbord)
- [Production](https://island.is/stjornbord)

## Getting started

You might need to setup x-road service.

```bash
sh ./scripts/run-xroad-proxy.sh
```

You can then proceed and start [the GraphQL API](../api/README.md#getting-started) and the admin portal:

```bash
yarn start portals-admin
```

## Docs

The admin portal shares a portal module system with the service portal. Read more about it [here](../../libs/portals/core/README.md).

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja)
