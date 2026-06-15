import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { EstatesPaths } from './paths'

export const estatesNavigation: PortalNavigationItem = {
  name: m.estates,
  description: m.myEstatesIntro,
  path: EstatesPaths.EstatesRoot,
  icon: {
    icon: 'receipt',
  },
  children: [
    {
      name: m.myEstates,
      description: m.myEstatesIntro,
      path: EstatesPaths.EstatesRoot,
      children: [
        {
          name: m.estatesDetail,
          navHide: true,
          path: EstatesPaths.EstatesDetail,
          children: [
            {
              name: 'skjol',
              navHide: true,
              path: EstatesPaths.EstatesFiles,
            },
          ],
        },
      ],
    },
  ],
}
