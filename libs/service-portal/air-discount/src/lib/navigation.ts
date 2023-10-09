import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AirDiscountPaths } from './paths'

export const airDiscountNavigation: PortalNavigationItem = {
  name: m.airDiscount,
  description: m.airDiscountDescription,
  path: AirDiscountPaths.AirDiscountRoot,
  icon: {
    icon: 'airplane',
    type: 'outline',
  },
}
