import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { IcelandicNamesRegistryPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'

export const icelandicNamesRegistryModule: PortalModule = {
  name: m.rootName,
  featureFlag: Features.servicePortalIcelandicNamesRegistryModule,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.rootName,
      path: IcelandicNamesRegistryPaths.IcelandicNamesRegistryRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/NamesEditor/NamesEditor')),
    },
  ],
}
