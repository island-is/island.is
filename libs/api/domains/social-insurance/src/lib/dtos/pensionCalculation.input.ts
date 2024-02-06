import { InputType, Field, registerEnumType } from '@nestjs/graphql'

export enum BasePensionType {
  Retirement = 'Retirement',
  FishermanRetirement = 'FishermanRetirement',
  Disability = 'Disability',
  Rehabilitation = 'Rehabilitation',
  HalfRetirement = 'HalfRetirement',
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

  @Field(() => Boolean, { nullable: true })
  mobilityImpairment?: boolean

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Number, { nullable: true })
  childCount?: number

  @Field(() => Number, { nullable: true })
  childSupportCount?: number

  @Field(() => Number, { nullable: true })
  ageOfFirst75DisabilityAssessment?: number

  @Field(() => Number, { nullable: true })
  livingConditionRatio?: number

  @Field(() => Number, { nullable: true })
  livingConditionAbroadInYears?: number

  @Field(() => Number, { nullable: true })
  taxCard?: number

  @Field(() => PeriodIncomeType, { nullable: true })
  typeOfPeriodIncome?: PeriodIncomeType

  @Field(() => Number, { nullable: true })
  income?: number

  @Field(() => Number, { nullable: true })
  pensionPayments?: number

  @Field(() => Number, { nullable: true })
  privatePensionPayments?: number

  @Field(() => Number, { nullable: true })
  otherIncome?: number

  @Field(() => Number, { nullable: true })
  capitalIncome?: number

  @Field(() => Number, { nullable: true })
  benefitsFromMunicipality?: number

  @Field(() => Number, { nullable: true })
  premium?: number

  @Field(() => Number, { nullable: true })
  installmentClaims?: number

  @Field(() => Number, { nullable: true })
  foreignBasicPension?: number

  @Field(() => Date)
  birthdate!: Date

  @Field(() => Date, { nullable: true })
  dateOfCalculations?: Date
}
