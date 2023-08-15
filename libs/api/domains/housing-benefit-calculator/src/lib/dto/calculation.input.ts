import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HousingBenefitCalculatorCalculationInput {
  @Field(() => Number)
  totalAssets!: number

  @Field(() => Number)
  totalIncome!: number

  @Field(() => Number)
  housingCosts!: number

  @Field(() => Number)
  numberOfHouseholdMembers!: number
}
