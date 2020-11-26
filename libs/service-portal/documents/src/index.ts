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
  widgets: () => [
    {
      name: rootName,
      render: () => lazy(() => import('./widgets/documentList')),
      weight: 0,
    },
  ],
  routes: () => [
    {
      name: rootName,
      path: ServicePortalPath.RafraenSkjolRoot,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
