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
        path: ServicePortalPath.MinarSidurRoot,
        icon: 'globe',
      },
      // Fjolskyldan
      {
        name: defineMessage({
          id: 'service.portal:family',
          defaultMessage: 'Default fjolskyldan',
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

      // Eignir
      {
        name: defineMessage({
          id: 'service.portal:assets',
          defaultMessage: 'Eignir',
        }),
        path: ServicePortalPath.EignirRoot,
        icon: 'calendar',
      },

      // Fjarmal
      {
        name: defineMessage({
          id: 'service.portal:finance',
          defaultMessage: 'Fjármál',
        }),
        path: ServicePortalPath.FjarmalRoot,
        icon: 'user',
        children: [
          {
            name: defineMessage({
              id: 'service.portal:vehicles',
              defaultMessage: 'Ökutæki',
            }),
            path: ServicePortalPath.FjarmalOkutaeki,
            external: true,
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
        icon: 'search',
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
        icon: 'user',
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
    ],
  },
]
