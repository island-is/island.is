import { InputType, Field } from '@nestjs/graphql'

@InputType('SocialInsurancePensionCalculationInput')
export class PensionCalculationInput {
  @Field(() => Number)
  typeOfBasePension!: number

  @Field(() => Boolean)
  hasSpouse!: boolean

  @Field(() => Number)
  livingCondition!: number

  @Field(() => Boolean)
  mobilityImpairment!: boolean

  @Field(() => Number)
  start!: number

  @Field(() => Number)
  yearOfBirth!: number

  @Field(() => Number)
  startPension!: number

  @Field(() => Number)
  childCount!: number

  @Field(() => Number)
  childSupportCount!: number

  @Field(() => Number)
  delayPension!: number

  @Field(() => Number)
  hurryPension!: number

  @Field(() => Number)
  ageOfFirst75DisabilityAssessment!: number

  @Field(() => Number)
  livingConditionRatio!: number

  @Field(() => Number)
  livingConditionAbroadInYears!: number

  @Field(() => Number)
  ageNow!: number

  @Field(() => Number)
  taxCard!: number

  @Field(() => Number)
  typeOfPeriodIncome!: number

  @Field(() => Number)
  income!: number

  @Field(() => Number)
  pensionPayments!: number

  @Field(() => Number)
  privatePensionPayments!: number

  @Field(() => Number)
  otherIncome!: number

  @Field(() => Number)
  capitalIncome!: number

  @Field(() => Number)
  benefitsFromMunicipality!: number

  @Field(() => Number)
  premium!: number

  @Field(() => Number)
  installmentClaims!: number

  @Field(() => Number)
  foreignBasicPension!: number

  @Field(() => Date)
  dateOfCalculations!: Date
}
