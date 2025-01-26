import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateDispensedItem')
export class DispensedItem {
  @Field()
  productId!: string

  @Field({ nullable: true })
  productName?: string

  @Field({ nullable: true })
  productStrength?: string

  @Field({ nullable: true })
  dispensedAmount?: string

  @Field({ nullable: true })
  dispensedAmountDisplay?: string

  @Field({ nullable: true })
  numberOfPackages?: string
}

@ObjectType('HealthDirectorateDispensation')
export class Dispensation {
  @Field(() => ID)
  id!: string

  @Field()
  dispensingAgentId!: string

  @Field({ nullable: true })
  dispensingAgentName?: string

  @Field(() => Date)
  dispensationDate!: Date

  @Field()
  dispensedItemsCount!: number

  @Field(() => [DispensedItem])
  dispensedItems!: DispensedItem[]
}
