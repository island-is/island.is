import { PortalNavigationItem, m } from '@island.is/portals/core'
import { ServicePortalPaths } from './paths'
import { documentsNavigation } from '@island.is/service-portal/documents'
import { financeNavigation } from '@island.is/service-portal/finance'
import { applicationsNavigation } from '@island.is/service-portal/applications'
import { assetsNavigation } from '@island.is/service-portal/assets'
import { educationNavigation } from '@island.is/service-portal/education'
import {
  companyNavigation,
  informationNavigation,
} from '@island.is/service-portal/information'
import { licenseNavigation } from '@island.is/service-portal/licenses'
import { educationLicenseNavigation } from '@island.is/service-portal/education-license'
import { transportsNavigation } from '@island.is/service-portal/transports'
import { personalInformationNavigation } from '@island.is/service-portal/settings/personal-information'
import {
  delegationsNavigation,
  delegationsNavigationChildren,
} from '@island.is/portals/shared-modules/delegations'
import { sessionsNavigation } from '@island.is/service-portal/sessions'

export const rootNavigationItem: PortalNavigationItem = {
  name: m.overview,
  systemRoute: true,
  path: ServicePortalPaths.Root,
  icon: {
    icon: 'dots',
  },
}

export const MAIN_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    documentsNavigation,
    applicationsNavigation,
    {
      ...delegationsNavigation,
      children: [...delegationsNavigationChildren, sessionsNavigation],
    },
    companyNavigation,
    personalInformationNavigation,
    informationNavigation,
    assetsNavigation,
    transportsNavigation,
    financeNavigation,
    educationNavigation,
    licenseNavigation,
    educationLicenseNavigation,
  ],
}
