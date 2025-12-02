import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { LicensePaths } from './paths'

export const licenseNavigation: PortalNavigationItem = {
  name: m.licenses,
  description: m.licensesDescription,
  intro: m.licensesIntro,
  searchTags: [
    s.licensesAlternative,
    s.licensesCard,
    m.passport,
    m.pCard,
    m.disabilityLicense,
    m.machineLicense,
    m.adrLicense,
    m.firearmLicense,
    m.drivingLicense,
    m.ehic,
    m.huntingLicense,
  ],
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
      path: LicensePaths.LicensesDetail,
    },
  ],
}
