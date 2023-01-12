import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { RegulationsAdminPaths } from './lib/paths'

export const regulationAdminModule: PortalModule = {
  name: 'Reglugerðir — vinnslusvæði',
  widgets: () => [],
  layout: 'full',
  routes: ({ userInfo }) => {
    return [
      {
        name: 'Reglugerðir — vinnslusvæði',
        path: RegulationsAdminPaths.RegulationsAdminRoot,
        enabled: userInfo.scopes.includes(
          AdminPortalScope.regulationAdminManage,
        ),
        render: () => lazy(() => import('./screens/Home')),
      },
      {
        name: 'Skrá nýja reglugerð',
        path: RegulationsAdminPaths.RegulationsAdminEdit,
        enabled: userInfo.scopes.includes(
          AdminPortalScope.regulationAdminManage,
        ),
        render: () => lazy(() => import('./screens/Edit')),
      },
      {
        name: 'Ráðuneyti',
        path: RegulationsAdminPaths.RegulationsAdminMinistries,
        enabled: userInfo.scopes.includes(
          AdminPortalScope.regulationAdminManage,
        ),
        render: () => lazy(() => import('./screens/Ministries')),
      },
    ]
  },
}
