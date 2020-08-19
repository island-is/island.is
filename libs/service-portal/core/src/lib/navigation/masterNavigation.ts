import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { ServicePortalPath } from './paths'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: 'Aðgerðir',
    children: [
      // Umsoknir
      {
        name: 'Umsóknir',
        path: ServicePortalPath.UmsoknirRoot,
        icon: 'user',
        children: [
          {
            name: 'Opnar umsóknir',
            path: ServicePortalPath.UmsoknirOpnarUmsoknir,
          },
          {
            name: 'Ný umsókn',
            path: ServicePortalPath.UmsoknirNyUmsokn,
          },
        ],
      },

      // Rafraen skjol
      {
        name: 'Rafræn skjöl',
        path: ServicePortalPath.RafraenSkjolRoot,
        icon: 'article',
      },

      // Stillingar
      {
        name: 'Stillingar',
        path: ServicePortalPath.StillingarRoot,
        icon: 'lock',
        children: [
          {
            name: 'Upplýsingar',
            path: ServicePortalPath.StillingarUpplysingar,
          },
          {
            name: 'Umboð',
            path: ServicePortalPath.StillingarUmbod,
          },
        ],
      },
    ],
  },
  {
    name: 'Upplýsingar',
    children: [
      // Fjolskyldan
      {
        name: 'Fjölskyldan',
        path: ServicePortalPath.FjolskyldanRoot,
        icon: 'user',
      },

      // Fjarmal
      {
        name: 'Fjármál',
        path: ServicePortalPath.FjarmalRoot,
        icon: 'user',
      },

      // Heilsa
      {
        name: 'Heilsa',
        path: ServicePortalPath.HeilsaRoot,
        icon: 'plus',
      },

      // Menntun
      {
        name: 'Menntun',
        path: ServicePortalPath.MenntunRoot,
        icon: 'search',
      },
    ],
  },
]
