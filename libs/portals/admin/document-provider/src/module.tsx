import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentProviderPaths } from './lib/paths'
import { m } from './lib/messages'

const DocumentProviders = lazy(() =>
  import('./screens/DocumentProviders/DocumentProviders'),
)
const SingleDocumentProvider = lazy(() =>
  import('./screens/SingleDocumentProvider/SingleDocumentProvider'),
)

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.documentProvider),
  routes: () => {
    return [
      {
        name: m.rootName,
        path: DocumentProviderPaths.DocumentProviderRoot,
        element: <DocumentProviders />,
      },
      {
        name: m.documentProviderSingle,
        path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
        element: <SingleDocumentProvider />,
      },
    ]
  },
}
