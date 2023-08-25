import { Field, InputType } from '@nestjs/graphql'

@InputType('HousingBenefitCalculatorCalculationInput')
export class CalculationInput {
  @Field(() => Number) // TODO: perhaps add a min/max validation
  numberOfHouseholdMembers!: number

  @Field(() => Number)
  totalMonthlyIncome!: number

  @Field(() => Number)
  totalAssets!: number

  @Field(() => Number)
  housingCostsPerMonth!: number
}
