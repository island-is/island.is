import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
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
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => {
    const enabled = userInfo.scopes.includes(ApiScope.internal)

    return [
      {
        name: m.rootName,
        path: DocumentProviderPaths.DocumentProviderRoot,
        enabled,
        element: <DocumentProviders />,
      },
      {
        name: m.documentProviderSingle,
        path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
        enabled,
        element: <SingleDocumentProvider />,
      },
    ]
  },
}
