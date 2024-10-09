# Admin Portal

## About

The admin portal enables government organizations to manage their needs on island.is. It shares technical architecture and module systems with the [service portal](../../service-portal/README.md).

## URLs

- Development: [http://localhost:4201](http://localhost:4201)
- Dev: [https://beta.dev01.devland.is/stjornbord](https://beta.dev01.devland.is/stjornbord)
- Staging: [https://beta.staging01.devland.is/stjornbord](https://beta.staging01.devland.is/stjornbord)
- Production: [https://island.is/stjornbord](https://island.is/stjornbord)

## Getting Started

You might need to set up the x-road service:

```bash
sh ./scripts/run-xroad-proxy.sh
```

Then start the [GraphQL API](../api/README.md#getting-started) and the admin portal:

```bash
yarn start portals-admin
```

## Documentation

The admin portal shares a portal module system with the service portal. Learn more [here](../../libs/portals/core/README.md).

## Code Owners and Maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja)
