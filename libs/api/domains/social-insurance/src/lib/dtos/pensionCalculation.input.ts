import { InputType, Field } from '@nestjs/graphql'

@InputType('SocialInsurancePensionCalculationInput')
export class PensionCalculationInput {
  @Field(() => Number, { nullable: true })
  typeOfBasePension?: number

  @Field(() => Boolean, { nullable: true })
  hasSpouse?: boolean

  @Field(() => Number, { nullable: true })
  livingCondition?: number

  @Field(() => Boolean, { nullable: true })
  mobilityImpairment?: boolean

  @Field(() => Number, { nullable: true })
  start?: number

  @Field(() => Number, { nullable: true })
  yearOfBirth?: number

  @Field(() => Number, { nullable: true })
  startPension?: number

  @Field(() => Number, { nullable: true })
  childCount?: number

  @Field(() => Number, { nullable: true })
  childSupportCount?: number

  @Field(() => Number, { nullable: true })
  delayPension?: number

  @Field(() => Number, { nullable: true })
  hurryPension?: number

  @Field(() => Number, { nullable: true })
  ageOfFirst75DisabilityAssessment?: number

  @Field(() => Number, { nullable: true })
  livingConditionRatio?: number

  @Field(() => Number, { nullable: true })
  livingConditionAbroadInYears?: number

  @Field(() => Number, { nullable: true })
  ageNow?: number

  @Field(() => Number, { nullable: true })
  taxCard?: number

  @Field(() => Number, { nullable: true })
  typeOfPeriodIncome?: number

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

  @Field(() => Date, { nullable: true })
  dateOfCalculations?: Date
}
