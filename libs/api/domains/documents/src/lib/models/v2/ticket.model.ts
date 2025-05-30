import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { DocumentComment } from './comment.model'

@ObjectType('DocumentTicket')
export class Ticket {
  @Field({ nullable: true })
  id?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdDate?: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedDate?: Date | null

  @Field(() => String, { nullable: true })
  subject?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  authorId?: string | null

  @Field(() => [DocumentComment], { nullable: true })
  comments?: DocumentComment[] | null
}
