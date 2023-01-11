import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentProviderPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'
import { m } from './lib/messages'

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  featureFlag: Features.servicePortalDocumentProviderModule,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.rootName,
      path: DocumentProviderPaths.DocumentProviderRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      name: m.documentProviderSingle,
      path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/SingleDocumentProvider/SingleDocumentProvider'),
        ),
    },
  ],
}
