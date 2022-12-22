<!-- gitbook-navigation: "Core" -->

# Portals Core

This library contains all the core functionality needed to build a library into our service or admin portals.

## Libraries

### About

Portal libraries are designed to be dynamically loaded into view when a user has access to their functionality and
has navigated to a part of its feature.

### When to create a new module

As the portals grow in size and complexity it can sometimes be hard to define if a feature belongs to a module or whether a new module should be created.

In general, a module is created for each specific service within the Island.is organization and belongs to a specific team within the Island.is organization. Maintenance and code ownership falls to that team but for larger modules that is not always the case.

Modules can define routes outside their "domain", e.g. a "Health" module can define routes such as `/stillingar/heilsa`.

It can help to think about modules as API domains, a new domain should be created for each branch of the services like `health, education, finance etc`.

This is simpler for admin portal module, create a new module for each self-contained admin system.

### Usage

```typescript
export interface PortalModule {
  name: string
  widgets: (props: PortalModuleProps) => PortalWidget[]
  routes: (props: PortalModuleProps) => PortalRoute[]
}
```

All libraries are implemented by defining an interface that gets loaded into portals on startup. This interface defines four aspects about the library:

- Name - The name of the library
- Widgets - A function that return an array of widgets
- Routes - A function that returns an array of routes
- Global - A function that returns an array of global components

### Widgets

A widget is a small component rendered on the frontpage that usually gives a small amount of basic info about the libraries functionality and information.
The widget function receives props of the type **≠PortalModuleProps** that it should use to determine which widgets should be presented in the portal and how they should be rendered.

```typescript
export interface PortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
```

The userInfo property contains information about the current session and user. Based on which user is logged in and what he has access to, different widgets could be rendered out for the user.

```typescript
export type PortalWidget = {
  name: string
  weight: number
  render: (props: PortalModuleProps) => PortalModuleRenderValue
}
```

The weight property determines where on the frontpage it should be rendered, the lower the weight, the higher up it will be.
The render returns a lazy loaded component.
An example of an implementation of a widget property might be something like this:

```typescript
widgets: ({ userInfo }) => {
  const applicationWidgets = [
    {
      name: 'Applications',
      weight: 2,
      render: () => lazy(() => import('./widgets/ApplicationOverview')),
    },
  ]
  const openApplications = getOpenApplicationsForUser(userInfo)
  if (openApplications.length > 0)
    applicationWidgets.push({
      name: 'Open Applications',
      weight: 1,
      render: () => lazy(() => import('widgets/OpenApplications')),
    })
  return applicationWidgets
}
```

### Routes

Routes function in many of the same ways as widgets but instead of returning an array of widgets they return an array of routes.

```typescript
export interface PortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
```

```typescript
export type PortalRoute = {
  name: string
  path: string | string[]
  render?: (props: PortalModuleProps) => PortalModuleRenderValue
}
```

Path defines at what path or paths this route should be rendered.

The render property returns a lazy loaded component to be rendered when the user navigates to the described path.

An example of an implementation of a route property might be something like this:

```typescript
routes: (userInfo) => {
  const applicationRoutes = [
    {
      name: 'Applications',
      path: ServicePortalPath.ApplicationRoot,
      render: () =>
        lazy(() => import('./screens/ApplicationList/ApplicationList')),
    },
  ]

  const protectedApplication = getProtectedApplication(userInfo)

  if (protectedApplication) {
    applicationRoutes.push({
      name: 'Super secret application screen',
      path: ServicePortalPath.UmsoknirSecret,
      render: () =>
        lazy(() => import('./screens/ProtectedScreen/ProtectedScreen')),
    })
  }

  return applicationRoutes
}
```

### Global Components

Global components will always be rendered by default
These are usually utility components that prompt the user about certain things or provide other global functionality
Example: A modal providing onboarding for unfilled user profiles

Global components should be used very sparingly to reduce harrassment on the user.

```typescript
interface PortalModule {
  global?: (props: PortalModuleProps) => Promise<PortalGlobalComponent[]>
}
```

An example of how a global component might be implemented

```typescript
global: async ({ client }) => {
  if (client.userDoesNotHaveAUserProfile())
    return [
      {
        render: () =>
          lazy(
            () =>
              import('./components/UserOnboardingModal/UserOnboardingModal'),
          ),
      },
    ]

  return []
}
```

A portal library might then look something like this:

```tsx
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'

export const applicationsModule: PortalModule = {
  name: 'Applications',
  widgets: () => [
    {
      name: 'Applications',
      weight: 0,
      render: () => lazy(() => import('./Widgets')),
    },
  ],
  routes: (userInfo) => {
    const applicationRoutes = [
      {
        name: 'Applications',
        path: ServicePortalPath.ApplicationRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}

// Widgets.tsx
const ApplicationWidgets: PortalModuleComponent = ({ userInfo }) => (
  <>
    <h1>Widgets for {userInfo.profile.name}</h1>
    <OpenApplications />
  </>
)

// ApplicationList.tsx
const ApplicationList: PortalModuleComponent = ({ userInfo }) => (
  <>
    <h1>Applications for {userInfo.profile.name}</h1>
    <div>Application 1</div>
    <div>Application 2</div>
    <div>Application 3</div>
  </>
)
```

## Running unit tests

Run `nx test portals-core` to execute the unit tests via [Jest](https://jestjs.io).
