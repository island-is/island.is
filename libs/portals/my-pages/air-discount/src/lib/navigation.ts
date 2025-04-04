import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { AirDiscountPaths } from './paths'

export const airDiscountNavigation: PortalNavigationItem = {
  name: m.airDiscount,
  description: m.airDiscountDescription,
  intro: m.airDiscountIntro,
  searchTags: [s.airDiscountFlight],
  path: AirDiscountPaths.AirDiscountRoot,
  icon: {
    icon: 'airplane',
    type: 'outline',
  },
  children: [
    {
      name: m.delegation,
      searchHide: true,
      path: AirDiscountPaths.AirDiscountRoot,
    },
  ],
}
