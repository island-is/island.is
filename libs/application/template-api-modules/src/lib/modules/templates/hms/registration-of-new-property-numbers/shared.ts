import { ApplicantType } from '@island.is/clients/hms-application-system'

export const APPLICATION_TYPE = 'LscVK9yI7EeXf4WDCOBfww' // This is fixed and comes from HMS
export const GUID = 'c7c13606-9a03-40ec-837b-ec5d7665a8fe' // HMS does nothing with this but it has to have a certain form for the request to go through

// Category of the data record
export enum NotandagognFlokkur {
  ApplicationSubmission = 'Skil á umsókn',
  Property = 'Eign',
  DerivedPropertyNumber = 'FastanúmerAfleiða',
}

// Data type (as returned by the 3rd-party API)
export enum NotandagognTegund {
  Boolean = 'bool',
  String = 'string',
  PropertyNumber = 'fastanúmer',
}

// "Heiti" = specific field/label name within a category
export enum NotandagognHeiti {
  DeclarationOfPropertyNumberRegistrationAwareness = 'Ég hef kynnt mér efnið á island.is um skráningu fasteigna',
  PrivacyPolicyAcknowledgement = 'Ég hef kynnt mér persónuverndarstefnu HMS',
  PropertyNumber = 'Fasteignanumer',
  Address = 'Heimili',
  PostalCode = 'Póstnúmer',
  SelectedUsageUnits = 'Valdar notkunareiningar',
  SelectedUnitsFireCompensation = 'Núverandi brunabótamat valdra notkunareininga',
  TotalFireCompensation = 'Núverandi heildar brunabótamat',
  Municipality = 'Sveitarfélag',
}

export const Tegund = {
  Person: ApplicantType.NUMBER_0,
  Company: ApplicantType.NUMBER_2,
} as const

export enum Hlutverk {
  Applicant = 'Umsækjandi',
}
