import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  userHasAccessToScope,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Stillingar',
        path: ServicePortalPath.StillingarRoot,
        render: () => lazy(() => import('./lib/service-portal-settings')),
      },
      {
        name: 'Umboð',
        path: ServicePortalPath.StillingarUmbod,
        render: () =>
          lazy(() => import('./screens/delegation/DelegationGreeting')),
      },
    ]

    if (userHasAccessToScope(userInfo, '@island.is/user/info.view?')) {
      routes.push({
        name: 'Notendaupplýsingar',
        path: ServicePortalPath.StillingarUpplysingar,
        render: () => lazy(() => import('./screens/subjectInfo/subjectInfo')),
      })
    }

    return routes
  },
}
