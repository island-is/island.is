import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { IcelandicNamesRegistryPaths } from './lib/paths'

export const icelandicNamesRegistryModule: PortalModule = {
  name: m.rootName,
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.icelandicNamesRegistry),
  routes: () => [
    {
      name: m.rootName,
      path: IcelandicNamesRegistryPaths.IcelandicNamesRegistryRoot,
      render: () => lazy(() => import('./screens/NamesEditor/NamesEditor')),
    },
  ],
}
