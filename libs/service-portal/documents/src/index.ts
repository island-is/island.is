import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Rafræn Skjöl',
})

export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: () => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
