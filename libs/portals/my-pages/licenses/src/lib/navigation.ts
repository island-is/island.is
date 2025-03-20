import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { LicensePaths } from './paths'

export const licenseNavigation: PortalNavigationItem = {
  name: m.licenses,
  description: m.licensesDescription,
  intro: m.licensesIntro,
  path: LicensePaths.LicensesRoot,
  icon: {
    icon: 'wallet',
  },
  children: [
    {
      name: m.myLicenses,
      searchHide: true,
      path: LicensePaths.LicensesRoot,
    },
    {
      navHide: true,
      name: m.detailInfo,
      path: LicensePaths.LicensesDetailV2,
    },
    {
      navHide: true,
      name: m.detailInfo,
      path: LicensePaths.LicensesDetail,
    },
    {
      navHide: true,
      name: m.passport,
      path: LicensePaths.LicensesPassportDetail,
      activeIfExact: false,
    },
  ],
}
