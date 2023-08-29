import { Field, InterfaceType } from '@nestjs/graphql'
import { HealthDirectorateLicense } from './healthDirectorateLicense.model'
import { EducationalLicense } from './educationalLicense.model'

@InterfaceType({
  resolveType(license) {
    if (license.legalEntityId) {
      return HealthDirectorateLicense
    }
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
