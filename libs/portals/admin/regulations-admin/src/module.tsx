import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { RegulationsAdminPaths } from './lib/paths'

const Home = lazy(() => import('./screens/Home'))
const Edit = lazy(() => import('./screens/Edit'))
const Ministries = lazy(() => import('./screens/Ministries'))

const creationScopes = {
  [AdminPortalScope.regulationAdmin]: true,
  [AdminPortalScope.regulationAdminManage]: true,
}

export const regulationAdminModule: PortalModule = {
  name: 'Reglugerðir',
  layout: 'full',
  enabled: ({ userInfo }) => {
    const mayCreate = !!userInfo.scopes.find((scope) => scope in creationScopes)
    const mayManage = userInfo.scopes.includes(
      AdminPortalScope.regulationAdminManage,
    )
    return mayCreate || mayManage
  },
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
        element: <Home />,
      },
      {
        name: 'Skrá nýja reglugerð',
        path: RegulationsAdminPaths.RegulationsAdminEdit,
        enabled: mayCreate,
        element: <Edit userInfo={userInfo} />,
      },
      {
        name: 'Skrá nýja reglugerð',
        path: RegulationsAdminPaths.RegulationsAdminEditStep,
        enabled: mayCreate,
        element: <Edit userInfo={userInfo} />,
      },
      {
        name: 'Ráðuneyti',
        path: RegulationsAdminPaths.RegulationsAdminMinistries,
        enabled: mayManage,
        element: <Ministries />,
      },
    ]
  },
}
