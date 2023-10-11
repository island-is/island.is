import {
  ObjectType,
  Field,
  ID,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql'
import { OccupationalLicensesError } from './occupationalLicenseError.model'

export enum OccupationalLicenseType {
  EDUCATION = 'EDUCATIONAL',
  HEALTH = 'HEALTH_DIRECTORATE',
}

export enum HealthDirectorateStatusType {
  valid = 'Í gildi',
  limited = 'Í gildi - Takmörkun',
  error = 'Ógilt',
}

export enum OccupationalLicenseStatus {
  valid = 'valid',
  error = 'error',
  limited = 'limited',
}

registerEnumType(OccupationalLicenseType, {
  name: 'OccupationalLicenseType',
})

registerEnumType(HealthDirectorateStatusType, {
  name: 'OccupationalLicenseHealthDirectorateStatusType',
})

registerEnumType(OccupationalLicenseStatus, {
  name: 'OccupationalLicenseStatus',
})

@InterfaceType({
  resolveType(license: OccupationalLicense) {
    switch (license.institution) {
      case 'HEALTH_DIRECTORATE':
        return HealthDirectorateLicense
      case 'EDUCATIONAL':
        return EducationalLicense
      default:
        throw new Error(`Invalid license type: ${license.institution}`)
    }
  },
})
export abstract class OccupationalLicense {
  @Field((type) => OccupationalLicenseType)
  institution!: OccupationalLicenseType

  @Field(() => ID)
  id!: string | number
  @Field(() => String)
  type!: string

  @Field(() => String)
  profession!: string

  @Field(() => String)
  validFrom!: string

  @Field(() => OccupationalLicenseStatus)
  isValid!: OccupationalLicenseStatus
}

@ObjectType('OccupationalLicensesEducationalLicense', {
  implements: OccupationalLicense,
})
export class EducationalLicense extends OccupationalLicense {
  @Field(() => String)
  downloadUrl?: string
}

@ObjectType('OccupationalLicensesHealthDirectorateLicense', {
  implements: OccupationalLicense,
})
export class HealthDirectorateLicense extends OccupationalLicense {
  @Field(() => String)
  legalEntityId!: string

  @Field(() => String, { nullable: true })
  holderName?: string

  @Field(() => String, { nullable: true })
  number?: string | null
}

@ObjectType('OccupationalLicenseResponse')
export class OccupationalLicenseResponse {
  @Field(() => [OccupationalLicense])
  items!: OccupationalLicense[]

  @Field(() => [OccupationalLicensesError])
  errors!: OccupationalLicensesError[]
}
