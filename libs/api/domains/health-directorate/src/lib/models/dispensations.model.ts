import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateDispensedItem')
export class DispensedItem {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  dosageInstructions?: string

  @Field({ nullable: true })
  strength?: string

  @Field({ nullable: true })
  amount?: string

  @Field({ nullable: true })
  numberOfPackages?: string

  @Field({ nullable: true })
  quantity?: string

  @Field(() => Boolean, { nullable: true })
  isExpired?: boolean
}

@ObjectType('HealthDirectorateDispensation')
export class Dispensation {
  @Field(() => Int)
  id!: number

  @Field({ nullable: true })
  agentName?: string

  @Field(() => Date)
  date!: Date

  @Field(() => Date, { nullable: true })
  lastDispensationDate?: Date

  @Field()
  count!: number

  @Field(() => [DispensedItem])
  items!: DispensedItem[]
}
