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
    {
      //hvar birtist þetta nafn... ?
      name: defineMessage({
        id: 'service.portal:document-provider-document-providers-title',
        defaultMessage: 'Skjalaveitendur',
      }),
      path: ServicePortalPath.DocumentProviderDocumentProviders,
      render: () => lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      //hvar birtist þetta nafn... ?
      name: defineMessage({
        id: 'service.portal:document-provider-my-categories-title',
        defaultMessage: 'Mínir flokkar',
      }),
      path: ServicePortalPath.DocumentProviderMyCategories,
      render: () => lazy(() => import('./screens/MyCategories/MyCategories')),
    },
    {
      //hvar birtist þetta nafn... ?
      name: defineMessage({
        id: 'service.portal:document-provider-settings-title',
        defaultMessage: 'Stillingar',
      }),
      path: ServicePortalPath.DocumentProviderSettings,
      render: () => lazy(() => import('./screens/Settings/Settings')),
    },
    {
      //hvar birtist þetta nafn... ?
      name: defineMessage({
        id: 'service.portal:document-provider-technical-information-title',
        defaultMessage: 'Tæknileg útfærsla',
      }),
      path: ServicePortalPath.DocumentProviderTechnicalInfo,
      render: () =>
        lazy(() =>
          import('./screens/TechnicalInformation/TechnicalInformation'),
        ),
    },
  ],
}
