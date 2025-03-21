import {
  GenericLicenseMetadata,
  GenericLicenseProviderId,
  GenericLicenseType,
} from './licenceService.type'

export const LICENSE_MAPPER_FACTORY = 'license-mapper-factory'
export const LICENSE_NAMESPACE = 'api.license-service'

export const DEFAULT_LICENSE_ID = 'default'

export const AVAILABLE_LICENSES: GenericLicenseMetadata[] = [
  {
    type: GenericLicenseType.FirearmLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
      referenceId: '06303',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.DriversLicense,
    provider: {
      id: GenericLicenseProviderId.NationalPoliceCommissioner,
      referenceId: '06303',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.AdrLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
      referenceId: '07331',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.MachineLicense,
    provider: {
      id: GenericLicenseProviderId.AdministrationOfOccupationalSafetyAndHealth,
      referenceId: '07331',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.DisabilityLicense,
    provider: {
      id: GenericLicenseProviderId.SocialInsuranceAdministration,
      referenceId: '07821',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.HuntingLicense,
    provider: {
      id: GenericLicenseProviderId.EnvironmentAgency,
      referenceId: '???', //TODO
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.PCard,
    provider: {
      id: GenericLicenseProviderId.DistrictCommissioners,
      referenceId: 'syslumenn',
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
  {
    type: GenericLicenseType.Ehic,
    provider: {
      id: GenericLicenseProviderId.IcelandicHealthInsurance,
      referenceId: '08202',
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
  {
    type: GenericLicenseType.Passport,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
      referenceId: '10601',
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
]
