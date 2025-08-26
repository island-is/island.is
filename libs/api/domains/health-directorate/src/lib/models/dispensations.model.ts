import { Field, ID, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'

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

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastDispensationDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  nextDispensationDate?: Date

  @Field()
  count!: number

  // TODO: Check if this should be nullable when service fixes
  @Field(() => [DispensedItem], { nullable: true })
  items?: DispensedItem[]
}
