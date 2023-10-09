import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HousingBenefitCalculationModel')
export class Calculation {
  @Field(() => Number, { nullable: true })
  maximumHousingBenefits?: number | null

  @Field(() => Number, { nullable: true })
  reductionsDueToIncome?: number | null

  @Field(() => Number, { nullable: true })
  reductionsDueToAssets?: number | null

  @Field(() => Number, { nullable: true })
  reductionsDueToHousingCosts?: number | null

  @Field(() => Number, { nullable: true })
  estimatedHousingBenefits?: number | null
}
