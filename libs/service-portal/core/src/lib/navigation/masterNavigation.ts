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
        name: defineMessage({
          id: 'service.portal:documents',
          defaultMessage: 'Rafræn skjöl',
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
        name: defineMessage({
          id: 'service.portal:user-info',
          defaultMessage: 'Mínar upplýsingar',
        }),
        path: ServicePortalPath.UserInfo,
        divider: true,
        icon: {
          type: 'outline',
          icon: 'person',
        },
      },
      {
        name: defineMessage({
          id: 'service.portal:family',
          defaultMessage: 'Fjölskyldan',
        }),
        path: ServicePortalPath.FamilyRoot,
        icon: {
          type: 'outline',
          icon: 'people',
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
        children: [
          {
            name: defineMessage({
              id: 'service.portal:educationLicense',
              defaultMessage: 'Starfsleyfi',
            }),
            path: ServicePortalPath.EducationLicense,
          },
          {
            name: defineMessage({
              id: 'service.portal:educationCareer',
              defaultMessage: 'Námsferill',
            }),
            path: ServicePortalPath.EducationCareer,
          },
        ],
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

      {
        name: defineMessage({
          id: 'service.portal:licenses',
          defaultMessage: 'Skilríki',
        }),
        path: ServicePortalPath.LicensesRoot,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'business',
        },
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.SettingsRoot,
        icon: {
          type: 'outline',
          icon: 'settings',
        },
        children: [
          {
            name: defineMessage({
              id: 'service.portal:personalInformation',
              defaultMessage: 'Persónuupplýsingar',
            }),
            path: ServicePortalPath.SettingsPersonalInformation,
          },
          {
            name: defineMessage({
              id: 'service.portal:accessControl',
              defaultMessage: 'Aðgangsstýring',
            }),
            path: ServicePortalPath.SettingsAccessControl,
          },
        ],
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
      // Fjarmal
      {
        name: defineMessage({
          id: 'service.portal:finance',
          defaultMessage: 'Fjármál',
        }),
        heading: defineMessage({
          id: 'service.portal:coming-soon',
          defaultMessage: 'Væntanlegt',
        }),
        path: ServicePortalPath.FinanceExternal,
        external: true,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'cellular',
        },
      },

      // Fasteignir
      {
        name: defineMessage({
          id: 'service.portal:real-estate',
          defaultMessage: 'Fasteignir',
        }),
        path: ServicePortalPath.RealEstateExternal,
        external: true,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'home',
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
