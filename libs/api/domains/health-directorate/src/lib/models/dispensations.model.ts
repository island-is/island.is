import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateDispensedItem')
export class DispensedItem {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  strength?: string

  @Field({ nullable: true })
  amount?: string

  @Field(() => Int, { nullable: true })
  numberOfPackages?: number
}

@ObjectType('HealthDirectorateDispensation')
export class Dispensation {
  @Field(() => Int)
  id!: number

  @Field({ nullable: true })
  agentName?: string

  @Field(() => Date)
  date!: Date

  @Field()
  count!: number

  @Field(() => [DispensedItem])
  items!: DispensedItem[]
}
