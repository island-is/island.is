import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { AirDiscountSchemePaths } from './paths'

export const airDiscountSchemeNavigation: PortalNavigationItem = {
  name: m.airDiscountScheme,
  path: AirDiscountSchemePaths.Root,
  icon: {
    icon: 'settings',
  },
  description: m.airDiscountSchemeDescription,
  children: [
    {
      name: m.overview,
      path: AirDiscountSchemePaths.Root,
      activeIfExact: true,
    },
    {
      name: m.createDiscount,
      path: AirDiscountSchemePaths.CreateDiscount,
    },
    {
      name: m.superDiscount,
      path: AirDiscountSchemePaths.SuperDiscount,
    },
  ],
}
