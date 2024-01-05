import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentsPaths } from './lib/paths'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const Overview = lazy(() => import('./screens/Overview/Overview'))

export const documentsModule: PortalModule = {
  name: rootName,
  layout: 'full',
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: DocumentsPaths.ElectronicDocumentsRoot,
      enabled: userInfo.scopes?.includes(DocumentsScope.main),
      element: <Overview />,
    },
  ],
}
