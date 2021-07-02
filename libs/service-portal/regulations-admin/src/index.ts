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
      //   id: 'service.portal:regulations-admin-home',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminRoot,
      render: () => lazy(() => import('./screens/Home')),
    },
    {
      name: 'Skrá nýja reglugerð',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin-edit',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminEdit,
      render: () => lazy(() => import('./screens/Edit')),
    },
    {
      name: 'Ráðuneyti',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin-edit',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminMinistries,
      render: () => lazy(() => import('./screens/Ministries')),
    },
  ],
}
