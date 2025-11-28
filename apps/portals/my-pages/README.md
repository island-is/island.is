# My Pages (Service Portal)

## About

My pages is the user personal pages where it will be able to find all the information relative to itself and companies, family, finances, applications and so on.

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

## Docs

Start by reading about the [portal module system](../../libs/portals/core/README.md).

### Adding a module to the service portal

To add a new module to the service-portal, import and add it to the list defined in [modules.ts](./src/store/modules.ts):

```tsx
// other imports...
import { myNewModule } from '@island.is/service-portal/my-new-module'

export const modules: PortalModule[] = [
  // other modules...
  myNewModule,
]
```

### Declaring routes in the service portal

Declaring a new route for the service portal involves a few steps:

- Declare a path for the route
- Declare a route in the master navigation
- Implement the route based on the user's authorization scope and return it so it gets rendered into the navigation.

#### Declaring a path for a library

All Service Portal paths are declared as an enum in [paths.ts](../../libs/service-portal/core/src/lib/navigation/paths.ts)

#### Declare a route in the master navigation

The master navigation is defined in the service portal core in [masterNavigation.ts](../../libs/service-portal/core/src/lib/navigation/masterNavigation.ts)
Navigation items are defined as such:

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

#### Implement the route

Each module implements its own routes (see above). Routes should only be returned if available to the session scope. Items will be rendered into the navigation if a route has been declared for it.

### Configuring route search behaviour

Each module is automatically added to the search index, except for modules hidden from navigation or are inaccessible for the user. The currently active route is also filtered out. Each route can opt out of being indexed by setting the `searchHide` property to `true`.

For optimal results, the `description` property should be set to the same message as is displayed in the dashboard and in the page header. If the dashboard message and the page header message are different, set the `intro` property as the header message id.

These messages must be stored in the `service.portal` CMS namespace.

For better results, consider adding some tags to the `searchTags` property. The tags to be added should be stored in the `sp.search.tags` CMS namespace.

### Sentry

A sentry project is available [here](https://sentry.io/organizations/island_is/issues/?project=5501494).

## Code owners and maintainers

- [Hugsmiðjan](https://github.com/orgs/island-is/teams/hugsmidjan)
- [Norda](https://github.com/orgs/island-is/teams/norda/members)
