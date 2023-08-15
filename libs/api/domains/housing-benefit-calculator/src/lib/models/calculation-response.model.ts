import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CalculationResponse {
  @Field(() => Number, { nullable: true })
  monthlyHousingBenefit?: number | null

  @Field(() => Number, { nullable: true })
  monthlyIncomeReduction?: number | null

  @Field(() => Number, { nullable: true })
  monthlyAssetReduction?: number | null

  @Field(() => Number, { nullable: true })
  monthlyMaxBenefit?: number | null

  @Field(() => Number, { nullable: true })
  monthlyHousingCostReduction?: number | null
}
