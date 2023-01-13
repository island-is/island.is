import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { RegulationsAdminPaths } from './lib/paths'

const creationScopes = {
  [AdminPortalScope.regulationAdmin]: true,
  [AdminPortalScope.regulationAdminManage]: true,
}

export const regulationAdminModule: PortalModule = {
  name: 'Reglugerðir — vinnslusvæði',
  layout: 'full',
  routes: ({ userInfo }) => {
    const mayCreate = !!userInfo.scopes.find((scope) => scope in creationScopes)
    const mayManage = userInfo.scopes.includes(
      AdminPortalScope.regulationAdminManage,
    )

    return [
      {
        name: 'Reglugerðir — vinnslusvæði',
        path: RegulationsAdminPaths.RegulationsAdminRoot,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Home')),
      },
      {
        name: 'Skrá nýja reglugerð',
        path: RegulationsAdminPaths.RegulationsAdminEdit,
        enabled: mayCreate,
        render: () => lazy(() => import('./screens/Edit')),
      },
      {
        name: 'Ráðuneyti',
        path: RegulationsAdminPaths.RegulationsAdminMinistries,
        enabled: mayManage,
        render: () => lazy(() => import('./screens/Ministries')),
      },
    ]
  },
}
