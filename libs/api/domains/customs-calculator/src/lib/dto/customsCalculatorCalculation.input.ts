import { Field, InputType } from '@nestjs/graphql'

@InputType('CustomsCalculatorCalculationInput')
export class CustomsCalculatorCalculationInput {
  @Field()
  tariffNumber!: string

  @Field()
  customsCode!: string

  @Field()
  referenceDate!: string

  @Field()
  currencyCode!: string

  @Field()
  productPrice!: string

  @Field()
  plasticPackagingKg!: string

  @Field()
  cardboardPackagingKg!: string

  @Field()
  unitCount!: string

  @Field()
  netWeightKg!: string

  @Field()
  liters!: string

  @Field()
  percentage!: string

  @Field()
  netNetWeightKg!: string

  @Field()
  sugar!: string

  @Field()
  sweetener!: string

  @Field()
  nedcEmission!: string

  @Field()
  nedcWeightedEmission!: string

  @Field()
  wltpEmission!: string

  @Field()
  wltpWeightedEmission!: string

  @Field()
  curbWeight!: string
}
