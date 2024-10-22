import { InputType, Field, registerEnumType, Int } from '@nestjs/graphql'

export enum BasePensionType {
  Retirement = 'Retirement',
  FishermanRetirement = 'FishermanRetirement',
  Disability = 'Disability',
  Rehabilitation = 'Rehabilitation',
  HalfRetirement = 'HalfRetirement',
  NewSystem = 'NewSystem',
}

registerEnumType(BasePensionType, {
  name: 'SocialInsurancePensionCalculationBasePensionType',
})

export enum LivingCondition {
  LivesAlone = 'LivesAlone',
  DoesNotLiveAlone = 'DoesNotLiveAlone',
}

registerEnumType(LivingCondition, {
  name: 'SocialInsurancePensionCalculationLivingCondition',
})

export enum PensionStart {
  Starts2017OrBefore = 'Starts2017OrBefore',
  Starts2018OrLater = 'Starts2018OrLater',
}

registerEnumType(PensionStart, {
  name: 'SocialInsurancePensionCalculationPensionStart',
})

export enum PeriodIncomeType {
  Month = 'Month',
  Year = 'Year',
}

registerEnumType(PeriodIncomeType, {
  name: 'SocialInsurancePensionCalculationPeriodIncomeType',
})

@InputType('SocialInsurancePensionCalculationInput')
export class PensionCalculationInput {
  @Field(() => BasePensionType, { nullable: true })
  typeOfBasePension?: BasePensionType

  @Field(() => Boolean, { nullable: true })
  hasSpouse?: boolean

  @Field(() => LivingCondition, { nullable: true })
  livingCondition?: LivingCondition

  @Field(() => Int, { nullable: true })
  startMonth?: number

  @Field(() => Int, { nullable: true })
  startYear?: number

  @Field(() => Int, { nullable: true })
  childCount?: number

  @Field(() => Int, { nullable: true })
  childSupportCount?: number

  @Field(() => Int, { nullable: true })
  ageOfFirst75DisabilityAssessment?: number

  @Field(() => Int, { nullable: true })
  livingConditionRatio?: number

  @Field(() => Int, { nullable: true })
  livingConditionAbroadInYears?: number

  @Field(() => Int, { nullable: true })
  taxCard?: number

  @Field(() => PeriodIncomeType, { nullable: true })
  typeOfPeriodIncome?: PeriodIncomeType

  @Field(() => Int, { nullable: true })
  income?: number

  @Field(() => Int, { nullable: true })
  pensionPayments?: number

  @Field(() => Int, { nullable: true })
  privatePensionPayments?: number

  @Field(() => Int, { nullable: true })
  otherIncome?: number

  @Field(() => Int, { nullable: true })
  capitalIncome?: number

  @Field(() => Int, { nullable: true })
  benefitsFromMunicipality?: number

  @Field(() => Int, { nullable: true })
  premium?: number

  @Field(() => Int, { nullable: true })
  installmentClaims?: number

  @Field(() => Int, { nullable: true })
  foreignBasicPension?: number

  @Field(() => Int, { nullable: true })
  birthMonth?: number

  @Field(() => Int, { nullable: true })
  birthYear?: number

  @Field(() => String, { nullable: true })
  dateOfCalculations?: string
}
