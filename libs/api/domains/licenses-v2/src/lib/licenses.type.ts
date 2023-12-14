export enum DataFieldType {
  GROUP = 'Group',
  CATEGORY = 'Category',
  VALUE = 'Value',
  TABLE = 'Table',
}

export enum MetaLinkType {
  EXTERNAL = 'External',
  DOWNLOAD = 'Download',
  PKPASS = 'PkPass',
}

export enum Provider {
  NATIONAL_POLICE_COMMISSIONER = 'NationalPoliceCommissioner',
  ENVIRONMENT_AGENCY = 'EnvironmentAgency',
  ADMINISTRATION_OF_OCCUPATIONAL_SAFETY_AND_HEALTH = 'AdministrationOfOccupationalSafetyAndHealth',
  SOCIAL_INSURANCE_ADMINISTRATION = 'SocialInsuranceAdministration', // Tryggingastofnun
  DISTRICT_COMMISSIONERS = 'DistrictCommissioners', // Sýslumenn
  ICELANDIC_HEALTH_INSURANCE = 'IcelandicHealthInsurance', // Sjúkratryggingar Íslands
}

export enum LicenseType {
  DRIVERS_LICENSE = 'DriversLicense',
  HUNTING_LICENSE = 'HuntingLicense',
  ADR_LICENSE = 'AdrLicense',
  MACHINE_LICENSE = 'MachineLicense',
  FIREARM_LICENSE = 'FirearmLicense',
  DISABILITY_LICENSE = 'DisabilityLicense',
  P_CARD = 'PCard',
  EHIC = 'Ehic',
}

export enum Status {
  UNKNOWN = 'Unknown',
  AVAILABLE = 'Available',
  NOT_AVAILABLE = 'NotAvailable',
}
