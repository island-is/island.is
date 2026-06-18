import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class CustomsCalculatorStatus {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  message?: string
}

@ObjectType('CustomsCalculatorTopLevelProductCategory')
export class TopLevelProductCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  parentLabel?: string | null

  @Field(() => String)
  label!: string

  @Field(() => String)
  description!: string

  @CacheField(() => [TopLevelProductCategory])
  children!: TopLevelProductCategory[]
}

@ObjectType('CustomsCalculatorBottomLevelProductCategory')
export class BottomLevelProductCategory {
  @Field(() => [String])
  parentLabels!: string[]

  @Field(() => ID)
  id!: string

  @Field(() => String)
  tariffNumber!: string

  @Field(() => String)
  label!: string

  @Field(() => String)
  description!: string
}

@ObjectType()
export class CustomsCalculatorProductCategoriesResponse {
  @Field(() => [TopLevelProductCategory])
  topLevel!: TopLevelProductCategory[]

  @Field(() => [BottomLevelProductCategory])
  bottomLevel!: BottomLevelProductCategory[]
}

@ObjectType()
export class CustomsCalculatorUnitsResponse {
  @Field(() => [String])
  units!: string[]
}

@ObjectType()
export class CustomsCalculatorCharge {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Int, { nullable: true })
  amount?: number

  @Field(() => Float, { nullable: true })
  percentage?: number

  @Field({ nullable: true })
  unit?: string
}

@ObjectType()
export class CustomsCalculatorCalculationResponse {
  @Field(() => [CustomsCalculatorCharge])
  charges!: CustomsCalculatorCharge[]

  @Field(() => Int)
  startAmount!: number

  @Field(() => Int)
  additionalAmount!: number

  @Field(() => Int)
  totalAmount!: number
}
