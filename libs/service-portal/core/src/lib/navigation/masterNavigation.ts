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
        icon: 'globe',
      },
      // Fjolskyldan
      {
        name: defineMessage({
          id: 'service.portal:family',
          defaultMessage: 'Fjölskyldan',
        }),
        path: ServicePortalPath.FjolskyldanRoot,
        icon: 'user',
        children: [
          {
            name: defineMessage({
              id: 'service.portal:my-info',
              defaultMessage: 'Mínar upplýsingar',
            }),
            path: ServicePortalPath.MinarUpplysingar,
            icon: 'user',
          },
        ],
      },

      // Fjarmal
      {
        name: defineMessage({
          id: 'service.portal:finance',
          defaultMessage: 'Fjármál',
        }),
        path: ServicePortalPath.FjarmalRoot,
        icon: 'info',
        children: [
          {
            name: defineMessage({
              id: 'service.portal:assets',
              defaultMessage: 'Eignir',
            }),
            path: ServicePortalPath.EignirRoot,
            icon: 'calendar',
          },
        ],
      },

      // Heilsa
      {
        name: defineMessage({
          id: 'service.portal:health',
          defaultMessage: 'Heilsa',
        }),
        path: ServicePortalPath.HeilsaRoot,
        icon: 'plus',
      },

      // Menntun
      {
        name: defineMessage({
          id: 'service.portal:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.MenntunRoot,
        icon: 'calendar',
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
        icon: 'file',
      },

      // Rafraen skjol
      {
        name: defineMessage({
          id: 'service.portal:documents',
          defaultMessage: 'Rafræn skjöl',
        }),
        path: ServicePortalPath.RafraenSkjolRoot,
        icon: 'article',
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.StillingarRoot,
        icon: 'lock',
        children: [
          {
            name: defineMessage({
              id: 'service.portal:delegation',
              defaultMessage: 'Umboð',
            }),
            path: ServicePortalPath.StillingarUmbod,
          },
        ],
      },

      // Greidslur

      {
        name: defineMessage({
          id: 'service.portal:payments',
          defaultMessage: 'Greiðslur',
        }),
        path: ServicePortalPath.FjarmalGreidslur,
        icon: 'toasterInfo',
      },
    ],
  },
]
