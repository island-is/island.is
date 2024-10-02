import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AirDiscountPaths } from './paths'
import { generateIntroComponent } from '../utils/generateIntroComponent'

export const airDiscountNavigation: PortalNavigationItem = {
  name: m.airDiscount,
  description: m.airDiscountDescription,
  serviceProvider: 'vegagerdin',
  serviceProviderTooltip: m.airDiscountTooltip,
  displayIntroHeader: true,
  path: AirDiscountPaths.AirDiscountRoot,
  icon: {
    icon: 'airplane',
    type: 'outline',
  },
  children: [
    {
      name: m.delegation,
      path: AirDiscountPaths.AirDiscountRoot,
      displayIntroHeader: true,
      introComponent: generateIntroComponent(),
    },
  ],
}
