import {
  GenericLicenseMetadata,
  GenericLicenseOrganizationSlug,
  GenericLicenseProviderId,
  GenericLicenseType,
} from './licenceService.type'

export const DEFAULT_CACHE_TTL = 1 * 1000 // 1 minute

export const LICENSE_MAPPER_FACTORY = 'license-mapper-factory'

export const TOKEN_SERVICE_PROVIDER = 'token_service_provider'

export const DEFAULT_LICENSE_ID = 'default'

export const LICENSE_SERVICE_CACHE_MANAGER_PROVIDER =
  'license_service_cache_manager_provider'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.FirearmLicense,
  },
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DriversLicense,
  },
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.AdrLicense,
  },
  {
    type: GenericLicenseType.MachineLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.MachineLicense,
  },
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
  },
  {
    type: GenericLicenseType.PCard,
    provider: {
      id: GenericLicenseProviderId.DistrictCommissioners,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.PCard,
  },
  {
    type: GenericLicenseType.Ehic,
    provider: {
      id: GenericLicenseProviderId.IcelandicHealthInsurance,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.EHIC,
  },
  {
    type: GenericLicenseType.Passport,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
    orgSlug: GenericLicenseOrganizationSlug.Passport,
  },
]
