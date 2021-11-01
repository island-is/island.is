import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { m } from '../messages'
import { ServicePortalPath } from './paths'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: m.info,
    children: [
      // Yfirlit
      {
        name: m.overview,
        systemRoute: true,
        path: ServicePortalPath.MinarSidurRoot,
        icon: {
          type: 'outline',
          icon: 'home',
        },
      },

      // Rafraen skjol
      {
        heading: m.service,
        name: m.documents,
        path: ServicePortalPath.ElectronicDocumentsRoot,
        icon: {
          type: 'outline',
          icon: 'reader',
        },
      },

      // Umsoknir
      {
        name: m.applications,
        path: ServicePortalPath.ApplicationRoot,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },

      // Min Gogn
      {
        heading: m.myInfo,
        name: m.userInfo,
        path: ServicePortalPath.MyInfoRoot,
        icon: {
          type: 'outline',
          icon: 'person',
        },
        children: [
          {
            name: m.detailInfo,
            navHide: true,
            path: ServicePortalPath.UserInfo,
          },
          {
            name: m.family,
            navHide: true,
            path: ServicePortalPath.FamilyRoot,
          },
          {
            // Petitions
            name: m.endorsements,
            path: ServicePortalPath.Petitions,
          },
          {
            // Petitions Admin
            name: m.endorsementsAdmin,
            path: ServicePortalPath.PetitionsAdminView,
          },
        ],
      },

      // Starfsleyfi
      {
        name: m.educationLicense,
        path: ServicePortalPath.EducationLicense,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
      },

      // Menntun
      {
        name: m.education,
        path: ServicePortalPath.EducationRoot,
        icon: {
          type: 'outline',
          icon: 'school',
        },
      },

      {
        name: m.documentProvider,
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
        name: m.icelandicNamesRegistry,
        path: ServicePortalPath.IcelandicNamesRegistryRoot,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },

      {
        name: m.licenses,
        path: ServicePortalPath.LicensesRoot,
        icon: {
          type: 'outline',
          icon: 'business',
        },
      },

      // Fjarmal
      {
        name: m.finance,
        path: ServicePortalPath.FinanceRoot,
        children: [
          {
            name: m.financeStatus,
            path: ServicePortalPath.FinanceStatus,
          },
          {
            name: m.financeTransactions,
            path: ServicePortalPath.FinanceTransactions,
          },
          {
            name: m.financeBills,
            path: ServicePortalPath.FinanceBills,
          },
          {
            name: m.financeEmployeeClaims,
            path: ServicePortalPath.FinanceEmployeeClaims,
          },
          {
            name: m.financeLocalTax,
            path: ServicePortalPath.FinanceLocalTax,
          },
        ],
        icon: {
          type: 'outline',
          icon: 'cellular',
        },
      },

      // Ökutæki
      {
        name: m.vehicles,
        path: ServicePortalPath.AssetsVehicles,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'car',
        },
      },
    ],
  },

  {
    name: m.actions,
    children: [
      // Fasteignir
      {
        heading: m.comingSoon,
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'home',
        },
      },

      // Stillingar
      {
        name: m.settings,
        path: ServicePortalPath.SettingsRoot,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'settings',
        },
        children: [
          {
            name: m.accessControl,
            path: ServicePortalPath.SettingsAccessControl,
            children: [
              {
                name: m.accessControlGrant,
                path: ServicePortalPath.SettingsAccessControlGrant,
              },
              {
                name: m.accessControlAccess,
                path: ServicePortalPath.SettingsAccessControlAccess,
              },
            ],
          },
          {
            name: m.personalInformation,
            path: ServicePortalPath.SettingsPersonalInformation,
          },
          {
            name: m.islykill,
            path: ServicePortalPath.SettingsIslykill,
          },
        ],
      },

      // Mín réttindi
      {
        name: m.delegation,
        path: ServicePortalPath.MyLicensesRoot,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
        children: [
          {
            name: m.parentalLeave,
            path: ServicePortalPath.ParentalLeave,
          },
          {
            name: m.drivingLicense,
            path: ServicePortalPath.DrivingLicense,
          },
        ],
      },
    ],
  },
]
