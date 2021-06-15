import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { m } from './lib/messages'

export const icelandicNamesRegistryModule: ServicePortalModule = {
  name: m.rootName,
  widgets: () => [],
  routes: () => [
    {
      name: m.rootName,
      path: ServicePortalPath.IcelandicNamesRegistryRoot,
      render: () => lazy(() => import('./screens/NamesEditor/NamesEditor')),
    },
  ],
}
