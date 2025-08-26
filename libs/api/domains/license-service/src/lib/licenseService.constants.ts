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
      entryId: '1QXklS0ez93a5YDe2AnCAC',
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
      entryId: '1QXklS0ez93a5YDe2AnCAC',
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
      entryId: '39S5VumPfb1hXBJm3SnE02',
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
      entryId: '39S5VumPfb1hXBJm3SnE02',
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
      entryId: '3dgsobJuiJXC1oOxhGpcUY',
    },
    pkpass: true,
    pkpassVerify: true,
    timeout: 100,
  },
  {
    type: GenericLicenseType.HuntingLicense,
    provider: {
      id: GenericLicenseProviderId.EnvironmentAgency,
      entryId: '6cP62GJiazMuEGa1J0lgfs',
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
      entryId: 'kENblMMMvZ3DlyXw1dwxQ',
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
      entryId: '3pZwAagW0UY26giHaxHthe',
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
  {
    type: GenericLicenseType.IdentityDocument,
    provider: {
      id: GenericLicenseProviderId.RegistersIceland,
      referenceId: '10601',
      entryId: 'i5go5A4ikV8muPfvr9o2v',
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
      entryId: 'i5go5A4ikV8muPfvr9o2v',
    },
    pkpass: false,
    pkpassVerify: false,
    timeout: 100,
  },
]
