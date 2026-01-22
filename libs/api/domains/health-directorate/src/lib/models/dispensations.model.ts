import { Field, ID, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType('HealthDirectorateDispensation')
export class Dispensation {
  @Field(() => Int)
  id!: number

  @Field({ nullable: true })
  pharmacy?: string

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field()
  count!: number

  @Field(() => ID)
  itemId!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  strength?: string

  @Field({ nullable: true })
  amount?: string
}
