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
        path: ServicePortalPath.ApplicationIntroduction,

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

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.UserProfileRoot,
        divider: true,
        icon: {
          type: 'outline',
          icon: 'settings',
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

      // Menntun
      {
        name: defineMessage({
          id: 'service.portal:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.EducationExternal,
        external: true,
        systemRoute: true,
        icon: {
          type: 'outline',
          icon: 'school',
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
