import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { DocumentComment } from './comment.model'

@ObjectType('DocumentTicket')
export class Ticket {
  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdDate?: Date | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedDate?: Date | null

  @Field(() => String, { nullable: true })
  subject?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => Number, { nullable: true })
  authorId?: number | null

  @Field(() => [DocumentComment], { nullable: true })
  comments?: DocumentComment[] | null
}
