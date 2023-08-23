import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicenseHealthDirectorateLicense')
export class HealthDirectorateLicense {
  @Field(() => ID)
  legalEntityId!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  profession?: string | null

  @Field(() => String, { nullable: true })
  license?: string | null

  @Field(() => String, { nullable: true })
  licenseNumber?: string | null

  @Field(() => Date, { nullable: true })
  validFrom?: Date | null

  @Field(() => Date, { nullable: true })
  validTo?: Date | null
}
