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
        path: [
          ServicePortalPath.StillingarRoot,
          ServicePortalPath.StillingarUmbod,
        ],
        render: () => lazy(() => import('./lib/service-portal-settings')),
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
