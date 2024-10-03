````markdown
# Portals Core

This library contains all the core functionality needed to build libraries for service or admin portals.

## Libraries

### Overview

Portal libraries are designed to be dynamically loaded into view when a user accesses their functionality and navigates to a feature.

### Guidelines for Creating New Modules

As portals expand, it can be challenging to determine if a feature belongs to an existing module or if a new module should be created.

In general:

- Create a module for each specific service within the Island.is organization, under the scope of a specific team.
- Maintenance and code ownership are typically the responsibility of the assigned team, though not always for larger modules.
- Modules can define routes outside their direct "domain." For example, a "Health" module might define routes like `/stillingar/heilsa`.
- It's helpful to think of modules as API domains; create a new domain for each branch of services, such as `health`, `education`, `finance`, etc.

For admin portal modules, create a new module for each self-contained admin system.

### Usage

```typescript
export interface PortalModule {
  name: string
  routes: (props: PortalModuleRoutesProps) => PortalRoute[]
}
```
````

All libraries are implemented by defining an interface loaded into portals on startup. This interface specifies two key aspects:

- **Name:** The library's name.
- **Routes:** A function returning an array of routes.

### Routes

The routes function returns an array of routes.

```typescript
export interface PortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
```

```typescript
import { RouteObject } from 'react-router-dom'

export type PortalRoute = RouteObject & {
  name: string
  path: string | string[]
  element?: RouteObject['element']
  loader?: RouteObject['loader']
  errorElement?: RouteObject['errorElement']
  action?: RouteObject['action']
  children?: PortalRoute['children']
}
```

- **Path:** Specifies where the route should be rendered.
- **Element:** Should be a lazy-loaded component rendered when the path is navigated to.

Example of route property implementation:

```tsx
const ApplicationList = lazy(
  () => import('./screens/ApplicationList/ApplicationList'),
)
const ProtectedScreen = lazy(
  () => import('./screens/ProtectedScreen/ProtectedScreen'),
)

routes: () => {
  const applicationRoutes = [
    {
      name: 'Applications',
      path: ServicePortalPath.ApplicationRoot,
      element: <ApplicationList />,
    },
  ]

  const protectedApplication = getProtectedApplication(userInfo)

  if (protectedApplication) {
    applicationRoutes.push({
      name: 'Super secret application screen',
      path: ServicePortalPath.UmsoknirSecret,
      element: <ProtectedScreen />,
    })
  }

  return applicationRoutes
}
```

A portal library may look like this:

```tsx
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'

const ApplicationList = lazy(
  () => import('./screens/ApplicationList/ApplicationList'),
)

export const applicationsModule: PortalModule = {
  name: 'Applications',
  routes: () => {
    const applicationRoutes = [
      {
        name: 'Applications',
        path: ServicePortalPath.ApplicationRoot,
        element: <ApplicationList />,
      },
    ]

    return applicationRoutes
  },
}

// ApplicationList.tsx
const ApplicationList = () => {
  const userInfo = useUserInfo()
  return (
    <>
      <h1>Applications for {userInfo.profile.name}</h1>
      <div>Application 1</div>
      <div>Application 2</div>
      <div>Application 3</div>
    </>
  )
}
```

## Running Unit Tests

Run `nx test portals-core` to execute the unit tests via [Jest](https://jestjs.io).

```

```
