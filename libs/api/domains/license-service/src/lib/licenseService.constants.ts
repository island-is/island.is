import {
  GenericLicenseMetadata,
  GenericLicenseOrganizationSlug,
  GenericLicenseProviderId,
  GenericLicenseType,
} from './licenceService.type'

export const LICENSE_MAPPER_FACTORY = 'license-mapper-factory'

export const DEFAULT_LICENSE_ID = 'default'

export const LICENSE_NAMESPACE = 'sp.license'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
      referenceId: '06303',
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.FirearmLicense,
  },
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
      referenceId: '06303',
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.DriversLicense,
  },
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
      referenceId: '07331',
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.AdrLicense,
  },
  {
    type: GenericLicenseType.MachineLicense,
    provider: {
      referenceId: '07331',
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.MachineLicense,
  },
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
      referenceId: '07821',
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.DisabilityLicense,
  },
  {
    type: GenericLicenseType.HuntingLicense,
    provider: {
      id: GenericLicenseProviderId.EnvironmentAgency,
      referenceId: '14211',
    },
    pkpass: true,
    pkpassVerify: true,
    orgSlug: GenericLicenseOrganizationSlug.HuntingLicense,
  },
  {
    type: GenericLicenseType.PCard,
    provider: {
      id: GenericLicenseProviderId.DistrictCommissioners,
      referenceId: '',
    },
    pkpass: false,
    pkpassVerify: false,
    orgSlug: GenericLicenseOrganizationSlug.PCard,
  },
  {
    type: GenericLicenseType.Ehic,
    provider: {
      id: GenericLicenseProviderId.IcelandicHealthInsurance,
      referenceId: '08202',
    },
    pkpass: false,
    pkpassVerify: false,
    orgSlug: GenericLicenseOrganizationSlug.EHIC,
  },
  {
    type: GenericLicenseType.Passport,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
      referenceId: '10601',
    },
    pkpass: false,
    pkpassVerify: false,
    orgSlug: GenericLicenseOrganizationSlug.Passport,
  },
]
