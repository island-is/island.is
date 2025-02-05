import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateDispensedItem')
export class DispensedItem {
  @Field()
  productId!: string

  @Field({ nullable: true })
  productName?: string

  @Field({ nullable: true })
  productStrength?: string

  @Field(() => Int, { nullable: true })
  dispensedAmount?: number

  @Field({ nullable: true })
  dispensedAmountDisplay?: string

  @Field(() => Int, { nullable: true })
  numberOfPackages?: number
}

@ObjectType('HealthDirectorateDispensation')
export class Dispensation {
  @Field(() => Int)
  id!: number

  @Field(() => Int)
  dispensingAgentId!: number

  @Field({ nullable: true })
  dispensingAgentName?: string

  @Field(() => Date)
  dispensationDate!: Date

  @Field()
  dispensedItemsCount!: number

  @Field(() => [DispensedItem])
  dispensedItems!: DispensedItem[]
}
