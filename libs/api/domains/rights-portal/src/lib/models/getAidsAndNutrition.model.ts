import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Refund {
  @Field()
  type!: string
  @Field(() => Int)
  value!: number
}

@ObjectType()
export class AidOrNutrition {
  @Field(() => ID)
  id!: number

  @Field()
  iso!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  maxUnitRefund?: string

  @Field(() => Refund)
  refund!: Refund

  @Field({ nullable: true })
  available?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  explanation?: string

  @Field({ nullable: true })
  validUntil?: Date

  @Field({ nullable: true })
  nextAllowedMonth?: string

  @Field()
  expiring!: boolean
}

@ObjectType()
export class AidsAndNutrition {
  @Field(() => [AidOrNutrition], { nullable: true })
  aids?: AidOrNutrition[]

  @Field(() => [AidOrNutrition], { nullable: true })
  nutrition?: AidOrNutrition[]
}
