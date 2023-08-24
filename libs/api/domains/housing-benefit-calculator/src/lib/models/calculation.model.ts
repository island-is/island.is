import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HousingBenefitCalculationModel')
export class Calculation {
  @Field(() => Number)
  maxBenefitPerMonth!: number

  @Field(() => Number)
  reductionsDueToIncome!: number

  @Field(() => Number)
  estimatedHousingBenefits!: number
}
