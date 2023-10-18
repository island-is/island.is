import { Field, InputType } from '@nestjs/graphql'

@InputType('HousingBenefitCalculatorCalculationInput')
export class CalculationInput {
  @Field(() => Number)
  numberOfHouseholdMembers!: number

  @Field(() => Number)
  totalMonthlyIncome!: number

  @Field(() => Number)
  totalAssets!: number

  @Field(() => Number)
  housingCostsPerMonth!: number
}
