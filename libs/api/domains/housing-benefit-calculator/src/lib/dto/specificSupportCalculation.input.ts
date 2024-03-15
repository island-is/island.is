import { Field, InputType } from '@nestjs/graphql'

@InputType('HousingBenefitCalculatorSpecificSupportCalculationInput')
export class SpecificSupportCalculationInput {
  @Field(() => Number)
  numberOfHouseholdMembers!: number

  @Field(() => Number)
  housingCostsPerMonth!: number
}
