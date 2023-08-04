import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from './paths'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: m.occupationalLicenses,
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.occupationalLicensesDescription,
}
