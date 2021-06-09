import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { ServicePortalPath } from './paths'
import { defineMessage } from 'react-intl'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: defineMessage({
      id: 'service.portal:info',
      defaultMessage: 'Upplýsingar',
    }),
    children: [
      // Yfirlit
      {
        name: defineMessage({
          id: 'service.portal:overview',
          defaultMessage: 'Yfirlit',
        }),
        systemRoute: true,
        path: ServicePortalPath.MinarSidurRoot,
        icon: {
          type: 'outline',
          icon: 'home',
        },
      },

      // Rafraen skjol
      {
        heading: defineMessage({
          id: 'service.portal:service',
          defaultMessage: 'Þjónusta',
        }),
        name: defineMessage({
          id: 'service.portal:documents',
          defaultMessage: 'Pósthólf',
        }),
        path: ServicePortalPath.ElectronicDocumentsRoot,
        icon: {
          type: 'outline',
          icon: 'reader',
        },
      },

      // Umsoknir
      {
        name: defineMessage({
          id: 'service.portal:applications',
          defaultMessage: 'Umsóknir',
        }),
        path: ServicePortalPath.ApplicationRoot,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },

      // Min Gogn
      {
        heading: defineMessage({
          id: 'service.portal:my-info',
          defaultMessage: 'Mín gögn',
        }),
        name: defineMessage({
          id: 'service.portal:user-info',
          defaultMessage: 'Mínar upplýsingar',
        }),
        path: ServicePortalPath.MyInfoRoot,
        icon: {
          type: 'outline',
          icon: 'person',
        },
        children: [
          {
            name: defineMessage({
              id: 'service.portal:detail-info',
              defaultMessage: 'Nánari upplýsingar',
            }),
            navHide: true,
            path: ServicePortalPath.UserInfo,
          },
          {
            name: defineMessage({
              id: 'service.portal:family',
              defaultMessage: 'Fjölskyldan',
            }),
            navHide: true,
            path: ServicePortalPath.FamilyRoot,
          },
        ],
      },

      // Starfsleyfi
      {
        name: defineMessage({
          id: 'service.portal:educationLicense',
          defaultMessage: 'Starfsleyfi',
        }),
        path: ServicePortalPath.EducationLicense,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
      },

      // Menntun
      {
        name: defineMessage({
          id: 'service.portal:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.EducationRoot,
        icon: {
          type: 'outline',
          icon: 'school',
        },
      },

      {
        name: defineMessage({
          id: 'service.portal:document-provider',
          defaultMessage: 'Skjalaveitur',
        }),
        path: ServicePortalPath.DocumentProviderRoot,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
        // The first release will only contain "Skjalaveitur" and only for the project owners.
        // Therefore 'children' are temporarily disabled to enhance the UX of the owners.
        // children: [
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-document-providers',
        //       defaultMessage: 'Skjalaveitendur',
        //     }),
        //     path: ServicePortalPath.DocumentProviderDocumentProviders,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-my-categories',
        //       defaultMessage: 'Mínar flokkar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderMyCategories,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-settings',
        //       defaultMessage: 'Stillingar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderSettingsRoot,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-technical-info',
        //       defaultMessage: 'Tæknilegar upplýsingar',
        //     }),
        //     path: ServicePortalPath.DocumentProviderTechnicalInfo,
        //   },
        //   {
        //     name: defineMessage({
        //       id: 'service.portal:document-provider-statistics',
        //       defaultMessage: 'Tölfræði',
        //     }),
        //     path: ServicePortalPath.DocumentProviderStatistics,
        //   },
        // ],
      },

      // Mannanafnaskrá
      {
        name: defineMessage({
          id: 'service.portal:icelandic-names-registry',
          defaultMessage: 'Mannanafnaskrá',
        }),
        path: ServicePortalPath.IcelandicNamesRegistryRoot,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },
    ],
  },
  {
    name: defineMessage({
      id: 'service.portal:actions',
      defaultMessage: 'Aðgerðir',
      description: 'Title of the actions category',
    }),
    children: [
      // Fasteignir
      {
        heading: defineMessage({
          id: 'service.portal:coming-soon',
          defaultMessage: 'Annað',
        }),
        name: defineMessage({
          id: 'service.portal:real-estate',
          defaultMessage: 'Fasteignir',
        }),
        path: ServicePortalPath.AssetsRoot,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'home',
        },
      },

      // Ökutæki
      {
        name: defineMessage({
          id: 'service.portal:vehicles',
          defaultMessage: 'Ökutæki',
        }),
        path: ServicePortalPath.AssetsVehicles,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'car',
        },
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.SettingsRoot,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'settings',
        },
      },

      // Mín réttindi
      {
        name: defineMessage({
          id: 'service.portal:delegation',
          defaultMessage: 'Mín réttindi',
        }),
        path: ServicePortalPath.MyLicensesRoot,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
        children: [
          {
            name: defineMessage({
              id: 'service.portal:parentalLeave',
              defaultMessage: 'Fæðingarorlof',
            }),
            path: ServicePortalPath.ParentalLeave,
          },
          {
            name: defineMessage({
              id: 'service.portal:drivingLicense',
              defaultMessage: 'Ökuréttindi',
            }),
            path: ServicePortalPath.DrivingLicense,
          },
        ],
      },
    ],
  },
]
