# Service Portal Core

This library contains all the core functionality needed to build a library into the service portal shell

## Libraries

### About

Service Portal libraries are designed to be dynamically loaded into view when a user has access to their functionality and
has navigated to a part if it's feature.

### Usage

```typescript
export interface ServicePortalModule {
  name: string
  widgets: (props: ServicePortalModuleProps) => ServicePortalWidget[]
  routes: (props: ServicePortalModuleProps) => ServicePortalRoute[]
}
```

All libraries are implemented by defining an interface that gets loaded into the service portal shell on startup. This interface defines three aspects about the library:

- Name - The name of the library
- Widgets - A function that return an array of lazy loaded widgets
- Routes

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
      path: ServicePortalPath.UmsoknirRoot,
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
        path: ServicePortalPath.UmsoknirRoot,
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
