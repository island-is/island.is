import { PortalNavigationItem, m } from '@island.is/portals/core'
import { restrictionsNavigation } from '@island.is/service-portal/restrictions'
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
import { occupationalLicensesNavigation } from '@island.is/service-portal/occupational-licenses'
import { airDiscountNavigation } from '@island.is/service-portal/air-discount'
import { healthNavigation } from '@island.is/service-portal/health'
import {
  delegationsNavigation,
  delegationsNavigationChildren,
} from '@island.is/portals/shared-modules/delegations'
import { sessionsNavigation } from '@island.is/service-portal/sessions'
import { consentNavigation } from '@island.is/service-portal/consent'
import { ServicePortalPaths } from '@island.is/service-portal/core'
import { socialInsuranceMaintenanceNavigation } from '@island.is/service-portal/social-insurance-maintenance'
import { lawAndOrderNavigation } from '@island.is/service-portal/law-and-order'
import { companySignatureCollectionNavigation } from '@island.is/service-portal/signature-collection'

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
      children: [
        ...delegationsNavigationChildren,
        sessionsNavigation,
        consentNavigation,
        restrictionsNavigation,
      ],
    },
    companyNavigation,
    companySignatureCollectionNavigation,
    informationNavigation,
    socialInsuranceMaintenanceNavigation,
    assetsNavigation,
    financeNavigation,
    licenseNavigation,
    healthNavigation,
    occupationalLicensesNavigation,
    airDiscountNavigation,
    educationNavigation,
    lawAndOrderNavigation,
  ],
}
