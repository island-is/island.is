import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

const rootName = defineMessage({
  id: 'sp.document-provider:title',
  defaultMessage: 'Skjalaveita',
})

export const documentProviderModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: () => [
    {
      name: rootName,
      path: ServicePortalPath.DocumentProviderRoot,
      render: () => lazy(() => import('./screens/Dashboard/Dashboard')),
    },
  ],
}
