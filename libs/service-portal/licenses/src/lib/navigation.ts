import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { LicensePaths } from './paths'

export const licenseNavigation: PortalNavigationItem = {
  name: m.licenses,
  path: LicensePaths.LicensesRoot,
  icon: {
    icon: 'wallet',
  },
  children: [
    {
      navHide: true,
      name: m.detailInfo,
      path: LicensePaths.LicensesDetail,
    },
    {
      navHide: true,
      name: m.passport,
      path: LicensePaths.LicensesPassportDetail,
    },
  ],
  description: m.licensesDescription,
}
