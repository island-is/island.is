import { m } from '@island.is/portals/my-pages/core'
import { MileageRegistrationPaths } from './paths'
import { PortalNavigationItem } from '@island.is/portals/core'

export const vehicleMileageNavigation: PortalNavigationItem = {
  name: m.vehiclesRegisterMileage,
  description: m.vehicleMileageDescription,
  path: MileageRegistrationPaths.MileageRegistration,
  icon: {
    icon: 'car',
  },
}
