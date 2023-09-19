import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HousingBenefitCalculationModel')
export class Calculation {
  @Field(() => Number, { nullable: true })
  maximumHousingBenefits?: number | null

  @Field(() => Number, { nullable: true })
  reductions?: number | null

  @Field(() => Number, { nullable: true })
  estimatedHousingBenefits?: number | null
}
