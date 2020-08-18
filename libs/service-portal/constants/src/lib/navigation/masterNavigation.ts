import { ServicePortalNavigationItem } from '@island.is/service-portal/core'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: 'Aðgerðir',
    children: [
      // Umsoknir
      {
        name: 'Umsóknir',
        path: '/umsoknir',
        icon: 'user',
        children: [
          {
            name: 'Opnar umsóknir',
            path: '/umsoknir/opnar-umsoknir',
          },
          {
            name: 'Ný umsókn',
            path: '/umsoknir/ny-umsokn',
          },
        ],
      },

      // Rafraen skjol
      {
        name: 'Rafræn skjöl',
        path: '/rafraen-skjol',
        icon: 'article',
      },

      // Stillingar
      {
        name: 'Stillingar',
        path: '/stillingar',
        icon: 'lock',
        children: [
          {
            name: 'Upplýsingar',
            path: '/stillingar/minar-upplysingar',
          },
          {
            name: 'Umboð',
            path: '/stillingar/umbod',
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
        path: '/fjolskyldan',
        icon: 'user',
      },

      // Fjarmal
      {
        name: 'Fjármál',
        path: '/fjarmal',
        icon: 'user',
      },

      // Heilsa
      {
        name: 'Heilsa',
        path: '/heilsa',
        icon: 'plus',
      },

      // Menntun
      {
        name: 'Menntun',
        path: '/menntun',
        icon: 'search',
      },
    ],
  },
]
