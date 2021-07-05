import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled: userInfo.scopes.includes(DocumentsScope.main),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
