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
      name: defineMessage({
        id: 'service.portal:document-provider-document-providers-title',
        defaultMessage: 'Skjalaveitendur',
      }),
      path: ServicePortalPath.DocumentProviderDocumentProviders,
      render: () =>
        lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      name: defineMessage({
        id: 'service.portal:document-provider-my-categories-title',
        defaultMessage: 'Mínir flokkar',
      }),
      path: ServicePortalPath.DocumentProviderMyCategories,
      render: () => lazy(() => import('./screens/MyCategories/MyCategories')),
    },
    {
      name: defineMessage({
        id: 'service.portal:document-provider-settings-title',
        defaultMessage: 'Stillingar',
      }),
      path: ServicePortalPath.DocumentProviderSettingsRoot,
      render: () => lazy(() => import('./screens/Settings/Settings')),
    },
    {
      name: defineMessage({
        id: 'sp.document-provider:edit-institution',
        defaultMessage: 'Breyta stofnun',
      }),
      path: ServicePortalPath.DocumentProviderSettingsEditInstituion,
      render: () =>
        lazy(() => import('./screens/Settings/EditIntitution/EditIntitution')),
    },
    {
      name: defineMessage({
        id: 'sp.document-provider:edit-responsible-contact',
        defaultMessage: 'Breyta Ábyrgðarmanni',
      }),
      path: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
      render: () =>
        lazy(() =>
          import(
            './screens/Settings/EditResponsibleContact/EditResponsibleContact'
          ),
        ),
    },
    {
      name: defineMessage({
        id: 'sp.document-provider:edit-technical-contact',
        defaultMessage: 'Breyta Ábyrgðarmanni',
      }),
      path: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
      render: () =>
        lazy(() =>
          import(
            './screens/Settings/EditTechnicalContact/EditTechnicalContact'
          ),
        ),
    },
    {
      name: defineMessage({
        id: 'sp.document-provider:edit-user-help-contact',
        defaultMessage: 'Breyta notendaaðstoð',
      }),
      path: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
      render: () =>
        lazy(() =>
          import('./screens/Settings/EditUserHelpContact/EditUserHelpContact'),
        ),
    },
    {
      name: defineMessage({
        id: 'sp.document-provider:edit-endpoints',
        defaultMessage: 'Breyta endapunkt',
      }),
      path: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
      render: () =>
        lazy(() => import('./screens/Settings/EditEndpoints/EditEndpoints')),
    },
    {
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
