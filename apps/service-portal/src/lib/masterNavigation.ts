import { PortalNavigationItem, m, PortalPaths } from '@island.is/portals/core'
import { ServicePortalPaths } from './paths'
import {
  documentsNavigation,
  DocumentsPaths,
} from '@island.is/service-portal/documents'
import {
  financeNavigation,
  FinancePaths,
} from '@island.is/service-portal/finance'
import {
  applicationsNavigation,
  ApplicationsPaths,
} from '@island.is/service-portal/applications'
import { assetsNavigation, AssetsPaths } from '@island.is/service-portal/assets'
import {
  documentProviderNavigation,
  DocumentProviderPaths,
} from '@island.is/service-portal/document-provider'
import {
  educationNavigation,
  EducationPaths,
} from '@island.is/service-portal/education'
import {
  icelandicNamesRegistryNavigation,
  IcelandicNamesRegistryPaths,
} from '@island.is/service-portal/icelandic-names-registry'
import {
  companyNavigation,
  informationNavigation,
  InformationPaths,
} from '@island.is/service-portal/information'
import {
  licenseNavigation,
  LicensePaths,
} from '@island.is/service-portal/licenses'
import {
  educationLicenseNavigation,
  EducationLicensePaths,
} from '@island.is/service-portal/education-license'
import {
  TransportPaths,
  transportsNavigation,
} from '@island.is/service-portal/transports'
import {
  personalInformationNavigation,
  PersonalInformationPaths,
} from '@island.is/service-portal/settings/personal-information'
import {
  DelegationPaths,
  delegationsNavigation,
} from '@island.is/portals/shared-modules/delegations'
import { PetitionPaths } from '@island.is/service-portal/endorsements'

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
    documentProviderNavigation,
    documentsNavigation,
    applicationsNavigation,
    personalInformationNavigation,
    informationNavigation,
    companyNavigation,
    licenseNavigation,
    educationLicenseNavigation,
    educationNavigation,
    assetsNavigation,
    icelandicNamesRegistryNavigation,
    financeNavigation,
    transportsNavigation,
    delegationsNavigation,
  ],
}
