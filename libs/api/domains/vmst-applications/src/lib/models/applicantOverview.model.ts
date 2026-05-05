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

  @Field(() => [String])
  preferredJobs!: string[]

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

  @Field(() => [String])
  employmentHistory!: string[]

  @Field(() => [String])
  educationHistory!: string[]

  @Field(() => [String])
  drivingLicenses!: string[]

  @Field(() => [VmstApplicantLanguageOverview])
  languageAbilities!: VmstApplicantLanguageOverview[]

  @Field(() => String, { nullable: true })
  serviceArea?: string | null

  @Field(() => Boolean, {
    nullable: true,
    description: 'Is current place of stay different from legal domicile',
  })
  currentAddressDifferent?: boolean | null

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Whether the applicant profile has been saved to EURES (European Employment Services), the EU job mobility portal.',
  })
  savedToEures?: boolean | null
}
