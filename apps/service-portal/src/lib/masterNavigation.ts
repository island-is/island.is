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

export const getNavigationByPath = (path: string) => {
  if (path.includes(DocumentProviderPaths.DocumentProviderRoot)) {
    return documentProviderNavigation
  } else if (path.includes(DocumentsPaths.ElectronicDocumentsRoot)) {
    return documentsNavigation
  } else if (path.includes(ApplicationsPaths.ApplicationRoot)) {
    return applicationsNavigation
  } else if (path.includes(PersonalInformationPaths.SettingsRoot)) {
    return personalInformationNavigation
  } else if (path.includes(InformationPaths.MyInfoRoot)) {
    return informationNavigation
  } else if (path.includes(InformationPaths.Company)) {
    return companyNavigation
  } else if (path.includes(LicensePaths.LicensesRoot)) {
    return licenseNavigation
  } else if (path.includes(EducationLicensePaths.EducationLicense)) {
    return educationLicenseNavigation
  } else if (path.includes(EducationPaths.EducationRoot)) {
    return educationNavigation
  } else if (path.includes(AssetsPaths.AssetsRoot)) {
    return assetsNavigation
  } else if (
    path.includes(IcelandicNamesRegistryPaths.IcelandicNamesRegistryRoot)
  ) {
    return icelandicNamesRegistryNavigation
  } else if (path.includes(FinancePaths.FinanceRoot)) {
    return financeNavigation
  } else if (path.includes(TransportPaths.AssetsVehicles)) {
    return transportsNavigation
  } else if (path.includes(DelegationPaths.Delegations)) {
    return delegationsNavigation
  }

  return undefined
}
