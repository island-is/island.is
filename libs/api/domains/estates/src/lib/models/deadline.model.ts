import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType('EstatesDeadline')
export class Deadline {
  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  detailedDescription?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date

  @Field(() => Int, { nullable: true })
  daysRemaining?: number
}
