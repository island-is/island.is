import { lazy } from 'react'

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
  name: 'Reglugerðir — vinnslusvæði',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const mayCreate = !!userInfo.scopes.find((scope) => scope in creationScopes)
    const mayManage = userInfo.scopes.includes(RegulationsAdminScope.manage)

    return [
      {
        name: 'Reglugerðir — vinnslusvæði',
        path: ServicePortalPath.RegulationsAdminRoot,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Home')),
      },
      {
        name: 'Skrá nýja reglugerð',
        path: ServicePortalPath.RegulationsAdminEdit,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Edit')),
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
