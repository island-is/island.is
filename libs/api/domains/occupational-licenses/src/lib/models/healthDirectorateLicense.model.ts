import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesHealthDirectorateLicense')
export class HealthDirectorateLicense {
  @Field(() => ID)
  legalEntityId!: string

  @Field(() => String)
  name?: string

  @Field(() => String)
  profession?: string | null

  @Field(() => String)
  license?: string | null

  @Field(() => String)
  licenseNumber?: string | null

  @Field(() => Date, { nullable: true })
  validFrom?: Date | null

  @Field(() => Date, { nullable: true })
  validTo?: Date | null

  @Field(() => Boolean, { nullable: true })
  isValid!: boolean | null
}
