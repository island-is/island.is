import { PortalNavigationItem, m } from '@island.is/portals/core'
import { restrictionsNavigation } from '@island.is/portals/my-pages/restrictions'
import { documentsNavigation } from '@island.is/portals/my-pages/documents'
import { financeNavigation } from '@island.is/portals/my-pages/finance'
import { applicationsNavigation } from '@island.is/portals/my-pages/applications'
import { assetsNavigation } from '@island.is/portals/my-pages/assets'
import { educationNavigation } from '@island.is/portals/my-pages/education'
import {
  companyInformationNavigation,
  informationNavigation,
} from '@island.is/portals/my-pages/information'
import { licenseNavigation } from '@island.is/portals/my-pages/licenses'
import { occupationalLicensesNavigation } from '@island.is/portals/my-pages/occupational-licenses'
import { airDiscountNavigation } from '@island.is/portals/my-pages/air-discount'
import { healthNavigation } from '@island.is/portals/my-pages/health'
import {
  delegationsNavigation,
  delegationsNavigationChildren,
} from '@island.is/portals/shared-modules/delegations'
import { sessionsNavigation } from '@island.is/portals/my-pages/sessions'
import { consentNavigation } from '@island.is/portals/my-pages/consent'
import { ServicePortalPaths } from '@island.is/portals/my-pages/core'
import { socialInsuranceMaintenanceNavigation } from '@island.is/portals/my-pages/social-insurance-maintenance'
import { lawAndOrderNavigation } from '@island.is/portals/my-pages/law-and-order'
import { companySignatureCollectionNavigation } from '@island.is/portals/my-pages/signature-collection'
import { vehicleMileageNavigation } from '@island.is/portals/my-pages/mileage-registration'

export const rootNavigationItem: PortalNavigationItem = {
  name: m.overview,
  systemRoute: true,
  breadcrumbHide: true,
  path: ServicePortalPaths.Root,
  icon: {
    icon: 'dots',
  },
}

export const MAIN_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    documentsNavigation,
    vehicleMileageNavigation,
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
    companySignatureCollectionNavigation,
    informationNavigation,
    companyInformationNavigation,
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
