````markdown
# Service Portal

## About

The service portal is the user's personal page where they can find all information related to themselves, family, finances, applications, and more.

## URLs

- [Development](http://localhost:4200)
- [Dev](https://beta.dev01.devland.is/minarsidur)
- [Staging](https://beta.staging01.devland.is/minarsidur)
- [Production](https://island.is/minarsidur)

## Getting Started

Before running the service portal, you need to set up the user-profile service. Follow [these steps](../services/user-profile/README.md#initial-setup) first.

You might also need to set up the X-Road service.

```bash
sh ./scripts/run-xroad-proxy.sh
```
````

Then, start [the GraphQL API](../api/README.md#getting-started) and the service portal:

```bash
yarn start service-portal
```

## Documentation

Start by reading about the [portal module system](../../libs/portals/core/README.md).

### Adding a Module to the Service Portal

To add a new module to the service portal, import and add it to the list defined in [modules.ts](./src/store/modules.ts):

```typescript
// other imports...
import { myNewModule } from '@island.is/service-portal/my-new-module'

export const modules: PortalModule[] = [
  // other modules...
  myNewModule,
]
```

### Declaring Routes in the Service Portal

Declaring a new route for the service portal involves a few steps:

- Declare a path for the route.
- Declare a route in the master navigation.
- Implement the route based on the user's authorization scope and return it, so it gets rendered into the navigation.

#### Declaring a Path for a Library

All service portal paths are declared as an enum in [paths.ts](../../libs/service-portal/core/src/lib/navigation/paths.ts).

#### Declare a Route in the Master Navigation

The master navigation is defined in the service portal core in [masterNavigation.ts](../../libs/service-portal/core/src/lib/navigation/masterNavigation.ts). Navigation items are defined as:

```typescript
export interface PortalNavigationItem {
  name: MessageDescriptor | string
  path?: ServicePortalPath
  external?: boolean
  // System routes are always rendered in the navigation
  systemRoute?: boolean
  icon?: Pick<IconProps, 'icon' | 'type'>
  children?: PortalNavigationItem[]
}
```

#### Implement the Route

Each module implements its own routes. Routes should only be returned if they are available to the session scope. Items will be rendered into the navigation if a route has been declared for them.

### Sentry

A Sentry project is available [here](https://sentry.io/organizations/island_is/issues/?project=5501494).

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
- [Norda](https://github.com/orgs/island-is/teams/norda/members)

```

```
