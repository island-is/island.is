import { ServicePortalNavigationItem } from '../service-portal-core'
import { m } from '../messages'
import { ServicePortalPath } from './paths'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: m.overview,
    systemRoute: true,
    path: ServicePortalPath.MinarSidurRoot,
    icon: {
      icon: 'home',
    },
    children: [
      // Rafraen skjol
      {
        name: m.documents,
        path: ServicePortalPath.ElectronicDocumentsRoot,
        icon: {
          icon: 'reader',
        },
        subscribesTo: 'documents',
        description: m.documentsDescription,
      },

      // Umsoknir
      {
        name: m.applications,
        path: ServicePortalPath.ApplicationRoot,
        icon: {
          icon: 'fileTrayFull',
        },
        children: [
          {
            name: m.inProgressApplications,
            path: ServicePortalPath.ApplicationInProgressApplications,
          },
          {
            name: m.unfinishedApplications,
            path: ServicePortalPath.ApplicationIncompleteApplications,
          },
          {
            name: m.finishedApplications,
            path: ServicePortalPath.ApplicationCompleteApplications,
          },
        ],
        description: m.applicationsDescription,
      },

      // Company
      {
        name: m.companyTitle,
        path: ServicePortalPath.Company,
        icon: {
          icon: 'business',
        },
        description: m.companyDescription,
      },

      // Min Gogn
      {
        name: m.userInfo,
        path: ServicePortalPath.MyInfoRoot,
        icon: {
          icon: 'person',
        },
        children: [
          {
            name: m.detailInfo,
            navHide: true,
            path: ServicePortalPath.UserInfo,
          },
          {
            name: m.familySpouse,
            navHide: true,
            path: ServicePortalPath.Spouse,
          },
          {
            name: m.familyChild,
            navHide: true,
            path: ServicePortalPath.Child,
          },
          {
            // Petitions
            name: m.petitions,
            path: ServicePortalPath.Petitions,
          },
          {
            // Petitions Admin
            name: m.endorsementsAdmin,
            path: ServicePortalPath.PetitionsAdminView,
          },
        ],
        description: m.userInfoDescription,
      },
      // Mín skírteini
      {
        name: m.licenses,
        path: ServicePortalPath.LicensesRoot,

        icon: {
          icon: 'wallet',
        },
        children: [
          {
            navHide: true,
            name: m.detailInfo,
            path: ServicePortalPath.LicensesDetail,
          },
          {
            navHide: true,
            name: m.passport,
            path: ServicePortalPath.LicensesPassportDetail,
          },
        ],
        description: m.licensesDescription,
      },
      // Starfsleyfi
      {
        name: m.occupationaLicenses,
        path: ServicePortalPath.OccupationalLicenses,
        icon: {
          icon: 'receipt',
        },
        description: m.occupationalLicensesNavIntro,
      },
      // Mín réttindi
      {
        name: m.delegation,
        path: ServicePortalPath.MyLicensesRoot,
        icon: {
          icon: 'receipt',
        },
        children: [
          {
            name: m.parentalLeave,
            path: ServicePortalPath.ParentalLeave,
          },
        ],
      },
      // Menntun
      {
        name: m.education,
        path: ServicePortalPath.EducationRoot,
        icon: {
          icon: 'school',
        },
        description: m.educationDescription,
      },
      // Heilsa
      {
        name: m.health,
        path: ServicePortalPath.HealthRoot,
        icon: {
          icon: 'heart',
        },
        description: m.healthDescription,
      },

      // Fasteignir
      {
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        icon: {
          icon: 'home',
        },
        children: [
          {
            name: 'id',
            navHide: true,
            path: ServicePortalPath.AssetsRealEstateDetail,
          },
        ],
        description: m.realEstateDescription,
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
            name: m.financeSchedules,
            path: ServicePortalPath.FinanceSchedule,
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
          icon: 'cellular',
        },
        description: m.financeDescription,
      },

      // Ökutæki
      {
        name: m.vehicles,
        path: ServicePortalPath.AssetsMyVehicles,
        icon: {
          icon: 'car',
        },
        children: [
          {
            name: m.myVehicles,
            path: ServicePortalPath.AssetsMyVehicles,
            children: [
              {
                // Path param reference
                name: 'id',
                navHide: true,
                path: ServicePortalPath.AssetsVehiclesDetail,
              },
            ],
          },
          {
            name: m.vehiclesLookup,
            path: ServicePortalPath.AssetsVehiclesLookup,
          },
          {
            name: m.vehiclesDrivingLessons,
            path: ServicePortalPath.AssetsVehiclesDrivingLessons,
          },
          {
            name: m.vehiclesHistory,
            path: ServicePortalPath.AssetsVehiclesHistory,
          },
        ],
        description: m.vehiclesDescription,
      },

      // Loftbrú
      {
        name: m.airDiscount,
        path: ServicePortalPath.AirDiscountRoot,

        icon: {
          icon: 'globe',
          type: 'outline',
        },
      },

      // Stillingar - hidden from nav
      {
        name: m.settings,
        navHide: true,
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
            name: m.mySettings,
            path: ServicePortalPath.SettingsPersonalInformation,
          },
          {
            name: m.email,
            path: ServicePortalPath.SettingsPersonalInformationEditEmail,
          },
          {
            name: m.phone,
            path: ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
          },
          {
            name: m.nudge,
            path: ServicePortalPath.SettingsPersonalInformationEditNudge,
          },
          {
            name: m.language,
            path: ServicePortalPath.SettingsPersonalInformationEditLanguage,
          },
        ],
      },
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        icon: {
          icon: 'lockClosed',
        },
        description: m.accessControlDescription,
      },
      // Aðgangsstýring umboð
      {
        name: m.accessControl,
        path: ServicePortalPath.AccessControlDelegations,
        icon: {
          icon: 'people',
        },
        description: m.accessControlDescription,
        children: [
          {
            name: m.accessControlDelegations,
            path: ServicePortalPath.AccessControlDelegations,
            navHide: true,
            children: [
              {
                name: m.accessControlGrant,
                path: ServicePortalPath.AccessControlDelegationsGrant,
                navHide: true,
              },
            ],
          },
          {
            name: m.accessControlDelegationsIncoming,
            path: ServicePortalPath.AccessControlDelegationsIncoming,
            navHide: true,
            breadcrumbHide: true,
          },
          {
            name: m.accessControlAccess,
            path: ServicePortalPath.AccessControlDelegationAccess,
            navHide: true,
          },
        ],
      },
    ],
  },
]
