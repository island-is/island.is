import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HousingBenefitCalculationModel')
export class Calculation {
  @Field(() => Number)
  maximumHousingBenefits!: number

  @Field(() => Number)
  reductions!: number

  @Field(() => Number)
  estimatedHousingBenefits!: number
}
