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
        // TODO: Figure out if (and then how) these names are ever used anywhere...
        name: 'Reglugerðir — skráning',
        path: ServicePortalPath.RegulationsAdminRoot,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Home')),
      },
      {
        name: 'Skrá nýja reglugerð',
        path: ServicePortalPath.RegulationsAdminEdit,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/EditDraft')),
      },
      {
        name: 'Ráðuneyti',
        path: ServicePortalPath.RegulationsAdminMinistries,
        enabled: mayManage,
        render: () => lazy(() => import('./screens/Ministries')),
      },
    ]
  },
}
