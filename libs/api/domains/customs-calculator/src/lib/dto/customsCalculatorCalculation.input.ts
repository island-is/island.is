import { Field, InputType } from '@nestjs/graphql'

@InputType('CustomsCalculatorCalculationInput')
export class CustomsCalculatorCalculationInput {
  @Field()
  tariffNumber!: string

  @Field()
  currencyCode!: string

  @Field(() => String, { nullable: true })
  priceWithShipping?: string | null

  @Field(() => String, { nullable: true })
  unitCount?: string | null

  @Field(() => String, { nullable: true })
  netWeightKg?: string | null

  @Field(() => String, { nullable: true })
  liters?: string | null

  @Field(() => String, { nullable: true })
  percentage?: string | null

  @Field(() => String, { nullable: true })
  nedcEmission?: string | null

  @Field(() => String, { nullable: true })
  nedcWeightedEmission?: string | null

  @Field(() => String, { nullable: true })
  wltpEmission?: string | null

  @Field(() => String, { nullable: true })
  wltpWeightedEmission?: string | null
}
