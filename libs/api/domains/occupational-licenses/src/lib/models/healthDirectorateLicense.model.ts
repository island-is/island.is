import { Field, ObjectType } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'

@ObjectType('OccupationalLicensesHealthDirectorateLicense', {
  implements: () => OccupationalLicense,
})
export class HealthDirectorateLicense implements OccupationalLicense {
  @Field(() => String)
  legalEntityId!: string

  @Field(() => String, { nullable: true })
  holderName?: string

  @Field(() => String)
  profession!: string

  @Field(() => String)
  type!: string

  @Field(() => String, { nullable: true })
  number?: string | null

  @Field(() => String)
  validFrom!: string

  @Field(() => Boolean)
  isValid!: boolean
}
