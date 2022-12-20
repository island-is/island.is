import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { m } from './lib/messages'

export const icelandicNamesRegistryModule: ServicePortalModule = {
  name: m.rootName,
  featureFlag: Features.servicePortalIcelandicNamesRegistryModule,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.rootName,
      path: ServicePortalPath.IcelandicNamesRegistryRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/NamesEditor/NamesEditor')),
    },
  ],
}
