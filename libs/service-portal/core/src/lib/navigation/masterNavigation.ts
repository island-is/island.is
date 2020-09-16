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

      // Min Sida
      {
        name: defineMessage({
          id: 'service.portal:my-info',
          defaultMessage: 'Mín síða',
        }),
        path: ServicePortalPath.MinarUpplysingar,
        icon: {
          type: 'outline',
          icon: 'person',
        },
      },

      // Fjolskyldan
      {
        name: defineMessage({
          id: 'service.portal:family',
          defaultMessage: 'Fjölskyldan',
        }),
        path: ServicePortalPath.FjolskyldanRoot,
        icon: {
          type: 'outline',
          icon: 'people',
        },
      },

      // Fjarmal
      {
        name: defineMessage({
          id: 'service.portal:finance',
          defaultMessage: 'Fjármál',
        }),
        path: ServicePortalPath.FjarmalRoot,
        icon: {
          type: 'outline',
          icon: 'cellular',
        },
      },

      // Eignir
      {
        name: defineMessage({
          id: 'service.portal:assets',
          defaultMessage: 'Eignir',
        }),
        path: ServicePortalPath.EignirRoot,
        icon: {
          type: 'outline',
          icon: 'wallet',
        },
      },

      // Menntun
      {
        name: defineMessage({
          id: 'service.portal:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.MenntunRoot,
        icon: {
          type: 'outline',
          icon: 'school',
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
      // Umsoknir
      {
        name: defineMessage({
          id: 'service.portal:applications',
          defaultMessage: 'Umsóknir',
        }),
        path: ServicePortalPath.UmsoknirRoot,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },

      // Rafraen skjol
      {
        name: defineMessage({
          id: 'service.portal:documents',
          defaultMessage: 'Rafræn skjöl',
        }),
        path: ServicePortalPath.RafraenSkjolRoot,
        icon: {
          type: 'outline',
          icon: 'reader',
        },
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:delegation',
          defaultMessage: 'Umboð',
        }),
        path: ServicePortalPath.StillingarUmbod,
        icon: {
          type: 'outline',
          icon: 'lockClosed',
        },
      },
    ],
  },
]
