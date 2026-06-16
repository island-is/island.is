import { Field, InputType } from '@nestjs/graphql'

@InputType('CustomsCalculatorCalculationInput')
export class CustomsCalculatorCalculationInput {
  @Field()
  tariffNumber!: string

  @Field()
  currencyCode!: string

  @Field()
  priceWithShipping!: string

  @Field()
  unitCount!: string

  @Field()
  netWeightKg!: string

  @Field()
  liters!: string

  @Field()
  percentage!: string

  @Field()
  nedcEmission!: string

  @Field()
  nedcWeightedEmission!: string

  @Field()
  wltpEmission!: string

  @Field()
  wltpWeightedEmission!: string
}
