import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentsPaths } from './lib/paths'
import { documentLoader } from './screens/Documents.loader'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const Overview = lazy(() => import('./screens/Overview/index'))

export const documentsModule: PortalModule = {
  name: rootName,
  layout: 'full',
  routes: ({ userInfo, ...rest }) => [
    {
      name: rootName,
      path: DocumentsPaths.ElectronicDocumentsRoot,
      enabled: userInfo.scopes?.includes(DocumentsScope.main),
      loader: documentLoader({ userInfo, ...rest }),
      element: <Overview />,
      children: [
        {
          name: rootName,
          path: DocumentsPaths.ElectronicDocumentSingle,
          enabled: userInfo.scopes?.includes(DocumentsScope.main),
          loader: documentLoader({ userInfo, ...rest }),
          element: <Overview />,
        },
      ],
    },
  ],
}
