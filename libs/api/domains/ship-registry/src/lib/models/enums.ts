import { registerEnumType } from '@nestjs/graphql'

export enum ShipRegistryCertificateStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  ReinspectionNeeded = 'reinspectionNeeded',
  InInspectionWindow = 'inInspectionWindow',
  Unknown = 'unknown',
}

registerEnumType(ShipRegistryCertificateStatus, {
  name: 'ShipRegistryCertificateStatus',
})

export enum ShipRegistrySailorCertificateStatus {
  Valid = 'Valid',
  Invalid = 'Invalid',
  Unknown = 'Unknown',
}

registerEnumType(ShipRegistrySailorCertificateStatus, {
  name: 'ShipRegistrySailorCertificateStatus',
})

export enum ShipRegistrySailorCrewRegistrationField {
  SHIP_NAME = 'SHIP_NAME',
  LENGTH = 'LENGTH',
  GROSS_TONNAGE = 'GROSS_TONNAGE',
  MAIN_ENGINE = 'MAIN_ENGINE',
  SHIP_REGISTRATION_NUMBER = 'SHIP_REGISTRATION_NUMBER',
  RANK = 'RANK',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  NUMBER_OF_DAYS = 'NUMBER_OF_DAYS',
}

registerEnumType(ShipRegistrySailorCrewRegistrationField, {
  name: 'ShipRegistrySailorCrewRegistrationField',
})
