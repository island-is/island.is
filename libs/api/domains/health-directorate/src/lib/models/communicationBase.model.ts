import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export abstract class CommunicationBase {
  @Field(() => ID)
  id!: string

  @Field(() => Int, { nullable: true })
  weeks?: number

  @Field(() => Int, { nullable: true })
  days?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTime?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  authorName?: string

  @Field({ nullable: true })
  subject?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}
