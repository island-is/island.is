# Service Portal

## About

The service portal provides users with personalized pages containing information about themselves, family, finances, applications, etc.

## URLs

- [Development](http://localhost:4200)
- [Dev](https://beta.dev01.devland.is/minarsidur)
- [Staging](https://beta.staging01.devland.is/minarsidur)
- [Production](https://island.is/minarsidur)

## Getting Started

Before running the service portal, set up the user-profile service. Follow [these steps](../services/user-profile/README.md#initial-setup) first.

You might need to set up the X-Road service.

```bash
sh ./scripts/run-xroad-proxy.sh
```

Start the [GraphQL API](../api/README.md#getting-started) and the service portal with:

```bash
yarn start service-portal
```

## Docs

Begin by reading about the [portal module system](../../libs/portals/core/README.md).

### Adding a Module to the Service Portal

To add a new module, import it and include it in [modules.ts](./src/store/modules.ts):

```typescript
// other imports...
import { myNewModule } from '@island.is/service-portal/my-new-module'

export const modules: PortalModule[] = [
  // other modules...
  myNewModule,
]
```

### Declaring Routes in the Service Portal

To declare a new route:

- Define a path in [paths.ts](../../libs/service-portal/core/src/lib/navigation/paths.ts).
- Add a route in the master navigation located in [masterNavigation.ts](../../libs/service-portal/core/src/lib/navigation/masterNavigation.ts).
- Implement the route based on user authorization and render it into the navigation.

#### Navigation Item Interface

```typescript
export interface PortalNavigationItem {
  name: MessageDescriptor | string
  path?: ServicePortalPath
  external?: boolean
  systemRoute?: boolean
  icon?: Pick<IconProps, 'icon' | 'type'>
  children?: PortalNavigationItem[]
}
```

### Sentry

Monitor issues on Sentry [here](https://sentry.io/organizations/island_is/issues/?project=5501494).

## Code Owners and Maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
- [Norda](https://github.com/orgs/island-is/teams/norda/members)
