import { lazy } from 'react'
// import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { RegulationsAdminScope } from '@island.is/auth/scopes'

export const regulationsAdminModule: ServicePortalModule = {
  name: 'Reglugerðir — skráning',
  widgets: () => [],
  routes: ({userInfo}) => [
    {
      name: 'Reglugerðir — skráning',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin-home',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      enabled: userInfo.scopes.includes(RegulationsAdminScope.create),
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
      enabled: userInfo.scopes.includes(RegulationsAdminScope.create),
      render: () => lazy(() => import('./screens/Edit')),
    },
    {
      name: 'Ráðuneyti',
      // name: defineMessage({
      //   id: 'service.portal:regulations-admin-edit',
      //   defaultMessage: 'Reglugerðir — skráning',
      // }),
      path: ServicePortalPath.RegulationsAdminMinistries,
      enabled: userInfo.scopes.includes(RegulationsAdminScope.manage),
      render: () => lazy(() => import('./screens/Ministries')),
    },
  ],
}
