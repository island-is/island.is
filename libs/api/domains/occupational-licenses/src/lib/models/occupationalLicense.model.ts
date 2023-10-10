import {
  ObjectType,
  Field,
  ID,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql'

export enum OccupationalLicenseType {
  EDUCATION = 'EDUCATIONAL',
  HEALTH = 'HEALTH_DIRECTORATE',
}

export enum HEATLH_DIRECTORATE_STATUS_TYPE {
  valid = 'Í gildi',
  limited = 'Í gildi - Takmörkun',
  error = 'Ógilt',
}

export type Validity = 'valid' | 'limited' | 'error'

registerEnumType(OccupationalLicenseType, {
  name: 'OccupationalLicenseType',
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

  @Field(() => String)
  isValid!: Validity
}

@ObjectType('OccupationalLicensesEducationalLicense', {
  implements: OccupationalLicense,
})
export class EducationalLicense extends OccupationalLicense {
  @Field(() => String, { nullable: true })
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
