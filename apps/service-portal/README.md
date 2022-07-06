# Service Portal

## About

The service portal is the user personal pages where it will be able to find all the information relative to itself, family, finances, applications and so on.

## Docs

[How to start implementing a new library into the Service Portal](../../libs/service-portal/core/README.md)

## URLs

- [Development] (http://localhost:4200)
- [Dev](https://beta.dev01.devland.is/minarsidur)
- [Staging](https://beta.staging01.devland.is/minarsidur)
- [Production](https://island.is/minarsidur)

## Getting started

Before running the service portal, you will need to setup the user-profile service. Follow [these steps](../services/user-profile/README.md#initial-setup) first.

You might need to setup x-road service.

```bash
sh ./scripts/run-xroad-proxy.sh
```

You can then proceed and start [the GraphQL API](../api/README.md#getting-started) and the service portal:

```bash
yarn start service-portal
```

### Sentry

A sentry project is available [here](https://sentry.io/organizations/island_is/issues/?project=5501494).

## Code owners and maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
- [Sendiráðið](https://github.com/orgs/island-is/teams/sendiradid/members)
