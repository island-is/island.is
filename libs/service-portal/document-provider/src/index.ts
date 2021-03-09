import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { m } from './lib/messages'

export const documentProviderModule: ServicePortalModule = {
  name: m.rootName,
  widgets: () => [],
  routes: () => [
    {
      name: m.rootName,
      path: ServicePortalPath.DocumentProviderRoot,
      render: () =>
        lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    },
    {
      name: m.documentProviderSingle,
      path: ServicePortalPath.DocumentProviderDocumentProvidersSingle,
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
    //   render: () => lazy(() => import('./screens/Dashboard/Dashboard')),
    // },
    // {
    //   name: m.documentProviders,
    //   path: ServicePortalPath.DocumentProviderDocumentProviders,
    //   render: () =>
    //     lazy(() => import('./screens/DocumentProviders/DocumentProviders')),
    // },
    // {
    //   name: m.MyCategories,
    //   path: ServicePortalPath.DocumentProviderMyCategories,
    //   render: () => lazy(() => import('./screens/MyCategories/MyCategories')),
    // },
    // {
    //   name: m.Settings,
    //   path: ServicePortalPath.DocumentProviderSettingsRoot,
    //   render: () => lazy(() => import('./screens/Settings/Settings')),
    // },
    // {
    //   name: m.EditInstitution,
    //   path: ServicePortalPath.DocumentProviderSettingsEditInstituion,
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/Settings/EditOrganisation/EditOrganisation'),
    //     ),
    // },
    // {
    //   name: m.EditResponsibleContact,
    //   path: ServicePortalPath.DocumentProviderSettingsEditResponsibleContact,
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
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/Settings/EditUserHelpContact/EditUserHelpContact'),
    //     ),
    // },
    // {
    //   name: m.EditEndPoints,
    //   path: ServicePortalPath.DocumentProviderSettingsEditEndpoints,
    //   render: () =>
    //     lazy(() => import('./screens/Settings/EditEndpoints/EditEndpoints')),
    // },
    // {
    //   name: m.TechnicalInformation,
    //   path: ServicePortalPath.DocumentProviderTechnicalInfo,
    //   render: () =>
    //     lazy(() =>
    //       import('./screens/TechnicalInformation/TechnicalInformation'),
    //     ),
    // },
    // {
    //   name: m.Statistics,
    //   path: ServicePortalPath.DocumentProviderStatistics,
    //   render: () => lazy(() => import('./screens/Statistics/Statistics')),
    // },
  ],
}
