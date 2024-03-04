import {
  GenericLicenseMetadata,
  GenericLicenseOrganizationSlug,
  GenericLicenseProviderId,
} from './licenceService.type'
import { LicenseType } from '@island.is/shared/constants'

export const DEFAULT_CACHE_TTL = 1 * 1000 // 1 minute

export const LICENSE_MAPPER_FACTORY = 'license-mapper-factory'

export const TOKEN_SERVICE_PROVIDER = 'token_service_provider'

export const DEFAULT_LICENSE_ID = 'default'

export const LICENSE_SERVICE_CACHE_MANAGER_PROVIDER =
  'license_service_cache_manager_provider'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: LicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.FirearmLicense,
  },
  {
    type: LicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DriversLicense,
  },
  {
    type: LicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.AdrLicense,
  },
  {
    type: LicenseType.MachineLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.MachineLicense,
  },
  {
    type: LicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
  },
  {
    type: LicenseType.PCard,
    provider: {
      id: GenericLicenseProviderId.DistrictCommissioners,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.PCard,
  },
  {
    type: LicenseType.Ehic,
    provider: {
      id: GenericLicenseProviderId.IcelandicHealthInsurance,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.EHIC,
  },
  {
    type: LicenseType.Passport,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.Passport,
  },
]
