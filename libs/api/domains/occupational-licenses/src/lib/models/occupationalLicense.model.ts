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

registerEnumType(OccupationalLicenseType, {
  name: 'OccupationalLicenseType',
})

@InterfaceType({
  resolveType(license: OccupationalLicense) {
    if (license.institution === 'HEALTH_DIRECTORATE') {
      return HealthDirectorateLicense
    }
    return EducationalLicense
  },
})
export abstract class OccupationalLicense {
  @Field((type) => OccupationalLicenseType)
  institution!: OccupationalLicenseType

  @Field(() => ID)
  id!: string
  @Field(() => String)
  type!: string

  @Field(() => String)
  profession!: string

  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => String)
  validFrom!: string
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
