import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicantLanguageOverview')
export class VmstApplicantLanguageOverview {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  proficiency?: string | null
}

@ObjectType('VmstApplicantOverview')
export class VmstApplicantOverview {
  @Field(() => String, { nullable: true })
  passCode?: string | null

  @Field(() => [String], { nullable: true })
  preferredJobs?: string[]

  @Field(() => String, { nullable: true })
  bankAccount?: string | null

  @Field(() => String, { nullable: true })
  union?: string | null

  @Field(() => String, { nullable: true })
  pensionFund?: string | null

  @Field(() => Int, { nullable: true })
  usedPersonalTaxCredit?: number | null

  @Field(() => Int, { nullable: true })
  numberOfChildren?: number | null

  @Field(() => [String], { nullable: true })
  employmentHistory?: string[]

  @Field(() => [String], { nullable: true })
  educationHistory?: string[]

  @Field(() => [String], { nullable: true })
  drivingLicenses?: string[]

  @Field(() => [VmstApplicantLanguageOverview], { nullable: true })
  languageAbilities?: VmstApplicantLanguageOverview[]

  @Field(() => String, { nullable: true })
  serviceArea?: string | null

  @Field(() => Boolean, { nullable: true })
  currentAddressDifferent?: boolean | null

  @Field(() => Boolean, { nullable: true })
  savedToEures?: boolean | null
}
