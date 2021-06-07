import { lazy } from 'react'
// import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const regulationsAdminModule: ServicePortalModule = {
  name: 'Reglugerðir — skráning',
  widgets: () => [],
  routes: () => [
    {
      name: 'Reglugerðir — skráning',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminRoot,
      render: () => lazy(() => import('./screens/Home')),
    },
    {
      name: 'Skrá nýja reglugerð',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminNew,
      render: () => lazy(() => import('./screens/Edit')),
    },
    {
      name: 'Skrá nýja reglugerð',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminEdit,
      render: () => lazy(() => import('./screens/Edit')),
    },
  ],
}
