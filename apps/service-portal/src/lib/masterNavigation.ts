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
import { vehiclesNavigation } from '@island.is/service-portal/vehicles'
import { personalInformationNavigation } from '@island.is/service-portal/settings/personal-information'
import { airDiscountNavigation } from '@island.is/service-portal/air-discount'
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
    icon: 'home',
  },
}

export const MAIN_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    documentsNavigation,
    applicationsNavigation,
    personalInformationNavigation,
    informationNavigation,
    companyNavigation,
    licenseNavigation,
    educationLicenseNavigation,
    educationNavigation,
    assetsNavigation,
    financeNavigation,
    vehiclesNavigation,
    airDiscountNavigation,
    {
      ...delegationsNavigation,
      children: [...delegationsNavigationChildren, sessionsNavigation],
    },
  ],
}
