import { m, PortalNavigationItem } from '@island.is/portals/core'
import { airDiscountNavigation } from '@island.is/portals/my-pages/air-discount'
import { applicationsNavigation } from '@island.is/portals/my-pages/applications'
import { assetsNavigation } from '@island.is/portals/my-pages/assets'
import {
  consentNavigation,
  consentNavigationNew,
} from '@island.is/portals/my-pages/consent'
import { ServicePortalPaths } from '@island.is/portals/my-pages/core'
import { directorateOfEqualityNavigation } from '@island.is/portals/my-pages/directorate-of-equality'
import { documentsNavigation } from '@island.is/portals/my-pages/documents'
import { educationNavigation } from '@island.is/portals/my-pages/education'
import { financeNavigation } from '@island.is/portals/my-pages/finance'
import { healthNavigation } from '@island.is/portals/my-pages/health'
import {
  companyInformationNavigation,
  informationNavigation,
} from '@island.is/portals/my-pages/information'
import { lawAndOrderNavigation } from '@island.is/portals/my-pages/law-and-order'
import { licenseNavigation } from '@island.is/portals/my-pages/licenses'
import { occupationalLicensesNavigation } from '@island.is/portals/my-pages/occupational-licenses'
import {
  restrictionsNavigation,
  restrictionsNavigationNew,
} from '@island.is/portals/my-pages/restrictions'
import {
  sessionsNavigation,
  sessionsNavigationNew,
} from '@island.is/portals/my-pages/sessions'
import { companySignatureCollectionNavigation } from '@island.is/portals/my-pages/signature-collection'
import { socialBenefitsNavigation } from '@island.is/portals/my-pages/social-benefits'
import {
  delegationsNavigation,
  delegationsNavigationChildren,
  delegationsNavigationChildrenNew,
  delegationsNavigationNew,
} from '@island.is/portals/shared-modules/delegations'

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
    applicationsNavigation,
    {
      ...delegationsNavigationNew,
      children: [
        ...delegationsNavigationChildrenNew,
        sessionsNavigationNew,
        consentNavigationNew,
        restrictionsNavigationNew,
      ],
    },
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
    directorateOfEqualityNavigation,
    socialBenefitsNavigation,
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
