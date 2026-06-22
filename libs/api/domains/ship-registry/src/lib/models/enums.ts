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
  Valid = 'valid',
  Invalid = 'invalid',
  Unknown = 'unknown',
}

registerEnumType(ShipRegistrySailorCertificateStatus, {
  name: 'ShipRegistrySailorCertificateStatus',
})

export enum ShipRegistrySailorCrewRegistrationField {
  SHIP_NAME = 'shipName',
  LENGTH = 'length',
  GROSS_TONNAGE = 'grossTonnage',
  MAIN_ENGINE = 'mainEngine',
  SHIP_REGISTRATION_NUMBER = 'shipRegistrationNumber',
  RANK = 'rank',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  NUMBER_OF_DAYS = 'numberOfDays',
}

registerEnumType(ShipRegistrySailorCrewRegistrationField, {
  name: 'ShipRegistrySailorCrewRegistrationField',
})
