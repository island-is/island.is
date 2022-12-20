import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { m } from './lib/messages'

export const documentProviderModule: ServicePortalModule = {
  name: m.rootName,
  featureFlag: Features.servicePortalDocumentProviderModule,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.rootName,
      path: ServicePortalPath.DocumentProviderRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      name: m.documentProviderSingle,
      path: ServicePortalPath.DocumentProviderDocumentProvidersSingle,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/SingleDocumentProvider/SingleDocumentProvider'),
        ),
    },
    // The first release will contain limited features and only for the project owners.
    // Therefore these paths are temporarily disabled to enhance the UX for the owners.
    // {
    //   name: m.rootName,
    //   path: ServicePortalPath.DocumentProviderRoot,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () => lazy(() => import('./screens/Dashboard/Dashboard')),
    // },
    // {
    //   name: m.documentProviders,
    //   path: ServicePortalPath.DocumentProviderDocumentProviders,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    // },
    // {
    //   name: m.MyCategories,
    //   path: ServicePortalPath.DocumentProviderMyCategories,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () => lazy(() => import('./screens/MyCategories/MyCategories')),
    // },
    // {
    //   name: m.Settings,
    //   path: ServicePortalPath.DocumentProviderSettingsRoot,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () => lazy(() => import('./screens/Settings/Settings')),
    // },
    // {
    //   name: m.EditInstitution,
    //   path: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/Settings/EditOrganisation/EditOrganisation'),
    //     ),
    // },
    // {
    //   name: m.EditResponsibleContact,
    //   path: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() =>
    //       import(
    //         './screens/Settings/EditResponsibleContact/EditResponsibleContact'
    //       ),
    //     ),
    // },
    // {
    //   name: m.EditTechnicalContact,
    //   path: ServicePortalPath.DocumentProviderSettingsEditTechnicalContact,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() =>
    //       import(
    //         './screens/Settings/EditTechnicalContact/EditTechnicalContact'
    //       ),
    //     ),
    // },
    // {
    //   name: m.EditUserHelpContact,
    //   path: ServicePortalPath.DocumentProviderSettingsEditUserHelpContact,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/Settings/EditUserHelpContact/EditUserHelpContact'),
    //     ),
    // },
    // {
    //   name: m.EditEndPoints,
    //   path: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() => import('./screens/Settings/EditEndpoints/EditEndpoints')),
    // },
    // {
    //   name: m.TechnicalInformation,
    //   path: ServicePortalPath.DocumentProviderTechnicalInfo,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/TechnicalInformation/TechnicalInformation'),
    //     ),
    // },
    // {
    //   name: m.Statistics,
    //   path: ServicePortalPath.DocumentProviderStatistics,
    //   enabled: userInfo.scopes.includes(ApiScope.internal),
    //   render: () => lazy(() => import('./screens/Statistics/Statistics')),
    // },
  ],
}
