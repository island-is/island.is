# Service Portal Core

This library contains all the core functionality needed to build a library into the service portal shell

## Libraries

### About

Service Portal libraries are designed to be dynamically loaded into view when a user has access to their functionality and
has navigated to a part of it's feature.

### When to create a new module

As the service portal grows in size and complexity it can sometimes be hard to define if a feature belongs to a module or whether a new module should be created.
In general, a module is created for each specific service within the Island.is organization and belongs to a specific team within the Island.is organization. Maintenance and code ownership falls to that team but for larger modules that is not always the case.
The service portal application supports modules defining routes outside of their "domain" so fx a "Health" module can define routes such as `/stillingar/heilsa`.
It can help to think about modules as API domains, a new domain should be created for each branch of the services like `health, education, finance etc`.

### Usage

```typescript
export interface ServicePortalModule {
  name: string
  widgets: (props: ServicePortalModuleProps) => ServicePortalWidget[]
  routes: (props: ServicePortalModuleProps) => ServicePortalRoute[]
}
```

All libraries are implemented by defining an interface that gets loaded into the service portal shell on startup. This interface defines four aspects about the library:

- Name - The name of the library
- Widgets - A function that return an array of widgets
- Routes - A function that returns an array of routes
- Global - A function that returns an array of global components

### Widgets

A widget is a small component rendered on the frontpage that usually gives a small amount of basic info about the libraries functionality and information.
The widget function receives props of the type **ServicePortalModuleProps** that it should use to determine which widgets should be presented to the Service Portal Shell and how they should be rendered.

```typescript
export interface ServicePortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
```

The userInfo property contains information about the current session and user. Based on which user is logged in and what he has access to, different widgets could be rendered out for the user.

```typescript
export type ServicePortalWidget = {
  name: string
  weight: number
  render: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
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
export interface ServicePortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
```

```typescript
export type ServicePortalRoute = {
  name: string
  path: ServicePortalPath | ServicePortalPath[]
  render?: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
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
{
  global?: (
    props: ServicePortalModuleProps,
  ) => Promise<ServicePortalGlobalComponent[]>
}
```

An example of how a global component might be implemented

```typescript
global: async ({ client }) => {
  if(client.userDoesNotHaveAUserProfile()) return [{
      render: () =>
        lazy(() =>
          import('./components/UserOnboardingModal/UserOnboardingModal'),
        ),
    }]

  return []
```

A service portal library might then look something like this:

```typescript
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const applicationsModule: ServicePortalModule = {
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
const ApplicationWidgets: ServicePortalModuleComponent = ({ userInfo }) => (
  <>
    <h1>Widgets for {userInfo.profile.name}</h1>
    <OpenApplications />
  </>
)

// ApplicationList.tsx
const ApplicationList: ServicePortalModuleComponent = ({ userInfo }) => (
  <>
    <h1>Applications for {userInfo.profile.name}</h1>
    <div>Application 1</div>
    <div>Application 2</div>
    <div>Application 3</div>
  </>
)
```

## Service Portal Shell

The application shell takes care of initializing and maintaining the libraries along with implementing core functionality in the Service Portal.

### Adding a library to the shell

Libraries are stored in the shell's store and loaded into view, to add a libary to the shell's module list, import and add it to the list defined in [modules.ts](../../../apps/service-portal/src/store/modules.ts)

```typescript
// other imports...
import { myNewModule } from '@island.is/service-portal/my-new-module'

export const modules: ServicePortalModule[] = [
  // other modules...
  myNewModule,
]
```

### Declaring routes for a library

Declaring a new route for the service portal involves a few steps:

- Declare a path for the route
- Declare a route in the master navigation
- Implement the route based on the user's authorization scope and return it so it gets rendered into the navigation.

#### Declaring a path for a library

All Service Portal paths are declared as an enum in [paths.ts](./src/lib/navigation/paths.ts)

#### Declare a route in the master navigation

The master navigation is defined in the service portal core in [masterNavigation.ts](./src/lib/navigation/masterNavigation.ts)
Navigation items are defined as such:

```typescript
export interface ServicePortalNavigationItem {
  name: MessageDescriptor | string
  path?: ServicePortalPath
  external?: boolean
  // System routes are always rendered in the navigation
  systemRoute?: boolean
  icon?: Pick<IconProps, 'icon' | 'type'>
  children?: ServicePortalNavigationItem[]
}
```

#### Implement the route

Each library implements it's own routes (see above). Routes should only be returned if available to the session scope. Items will be rendered into the navigation if a route has been declared for it.
