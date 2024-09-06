import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType, Int } from '@nestjs/graphql'

@ObjectType('CostOfLivingCalculatorModel')
export class CostOfLivingCalculatorItem {
  @Field(() => String)
  numberOf!: string

  @Field(() => Int)
  clothes!: number

  @Field(() => Int)
  medicalCost!: number

  @Field(() => Int)
  food!: number

  @Field(() => Int)
  otherServices!: number

  @Field(() => Int)
  transport!: number

  @Field(() => Int)
  communication!: number

  @Field(() => Int)
  total!: number

  @Field(() => String)
  text!: string

  @Field(() => Int)
  hobby!: number
}

@ObjectType('CostOfLivingCalculatorResponseModel')
export class CostOfLivingCalculatorResponse {
  @CacheField(() => [CostOfLivingCalculatorItem])
  items!: CostOfLivingCalculatorItem[]
}
