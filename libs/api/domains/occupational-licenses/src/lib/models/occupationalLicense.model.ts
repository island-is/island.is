import { ObjectType, Field, ID, InterfaceType } from '@nestjs/graphql'

@InterfaceType({
  resolveType(license: OccupationalLicense) {
    /*if (license.legalEntityId) {
      return HealthDirectorateLicense
    }*/
    return EducationalLicense
  },
})
export abstract class OccupationalLicense {
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
  @Field(() => ID)
  id!: string

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
