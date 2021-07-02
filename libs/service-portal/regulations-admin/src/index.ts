import { lazy } from 'react'
// import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { RegulationsAdminScope } from '@island.is/auth/scopes'

const creationScopes = {
  [RegulationsAdminScope.create]: true,
  [RegulationsAdminScope.manage]: true,
}

export const regulationsAdminModule: ServicePortalModule = {
  name: 'Reglugerðir — skráning',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const mayCreate = !!userInfo.scopes.find((scope) => scope in creationScopes)
    const mayManage = userInfo.scopes.includes(RegulationsAdminScope.manage)

    return [
      {
        name: 'Reglugerðir — skráning',
        // name: defineMessage({
        //   id: 'service.portal:regulations-admin-home',
        //   defaultMessage: 'Reglugerðir — skráning',
        // }),
        path: ServicePortalPath.RegulationsAdminRoot,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Home')),
      },
      {
        name: 'Skrá nýja reglugerð',
        // name: defineMessage({
        //   id: 'service.portal:regulations-admin-edit',
        //   defaultMessage: 'Reglugerðir — skráning',
        // }),
        path: ServicePortalPath.RegulationsAdminEdit,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Edit')),
      },
      {
        name: 'Ráðuneyti',
        // name: defineMessage({
        //   id: 'service.portal:regulations-admin-edit',
        //   defaultMessage: 'Reglugerðir — skráning',
        // }),
        path: ServicePortalPath.RegulationsAdminMinistries,
        enabled: mayManage,
        render: () => lazy(() => import('./screens/Ministries')),
      },
    ]
  },
}
