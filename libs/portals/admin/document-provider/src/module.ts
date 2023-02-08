import { lazy } from 'react'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentProviderPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'
import { m } from './lib/messages'

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  enabled: ({ userInfo }) => {
    return userInfo.scopes.includes(AdminPortalScope.documentProvider)
  },
  routes: () => [
    {
      name: m.rootName,
      path: DocumentProviderPaths.DocumentProviderRoot,
      render: () =>
        lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      name: m.documentProviderSingle,
      path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
      render: () =>
        lazy(() =>
          import('./screens/SingleDocumentProvider/SingleDocumentProvider'),
        ),
    },
  ],
}
