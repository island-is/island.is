import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentComment')
export class DocumentComment {
  @Field(() => Int, { nullable: true })
  id?: number | null

  @Field(() => String, { nullable: true })
  body?: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdDate?: Date | null

  @Field(() => Int, { nullable: true })
  authorId?: number | null

  @Field(() => String, { nullable: true })
  author?: string | null
}
