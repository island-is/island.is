import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { ServicePortalPath } from './paths'
import { defineMessage } from 'react-intl'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: defineMessage({
      id: 'sp:info',
      defaultMessage: 'Upplýsingar',
    }),
    children: [
      // Yfirlit
      {
        name: defineMessage({
          id: 'sp:overview',
          defaultMessage: 'Yfirlit',
        }),
        path: ServicePortalPath.MinarSidurRoot,
        icon: 'globe',
      },
      // Fjolskyldan
      {
        name: defineMessage({
          id: 'sp:family',
          defaultMessage: 'Fjölskyldan',
        }),
        path: ServicePortalPath.FjolskyldanRoot,
        icon: 'user',
        children: [
          {
            name: defineMessage({
              id: 'sp:my-info',
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
          id: 'sp:assets',
          defaultMessage: 'Eignir',
        }),
        path: ServicePortalPath.EignirRoot,
        icon: 'calendar',
      },

      // Fjarmal
      {
        name: defineMessage({
          id: 'sp:finance',
          defaultMessage: 'Fjármál',
        }),
        path: ServicePortalPath.FjarmalRoot,
        icon: 'user',
        children: [
          {
            name: defineMessage({
              id: 'sp:vehicles',
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
          id: 'sp:health',
          defaultMessage: 'Heilsa',
        }),
        path: ServicePortalPath.HeilsaRoot,
        icon: 'plus',
      },

      // Menntun
      {
        name: defineMessage({
          id: 'sp:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.MenntunRoot,
        icon: 'search',
      },
    ],
  },
  {
    name: defineMessage({
      id: 'sp:actions',
      defaultMessage: 'Aðgerðir',
      description: 'Title of the actions category',
    }),
    children: [
      // Umsoknir
      {
        name: defineMessage({
          id: 'sp:applications',
          defaultMessage: 'Umsóknir',
        }),
        path: ServicePortalPath.UmsoknirRoot,
        icon: 'user',
      },

      // Rafraen skjol
      {
        name: defineMessage({
          id: 'sp:documents',
          defaultMessage: 'Rafræn skjöl',
        }),
        path: ServicePortalPath.RafraenSkjolRoot,
        icon: 'article',
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'sp:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.StillingarRoot,
        icon: 'lock',
        children: [
          {
            name: defineMessage({
              id: 'sp:delegation',
              defaultMessage: 'Umboð',
            }),
            path: ServicePortalPath.StillingarUmbod,
          },
        ],
      },
    ],
  },
]
