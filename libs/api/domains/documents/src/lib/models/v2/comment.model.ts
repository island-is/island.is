import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentComment')
export class DocumentComment {
  @Field(() => String, { nullable: true })
  id?: string | null

  @Field(() => String, { nullable: true })
  body?: string | null

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdDate?: Date | null

  @Field(() => String, { nullable: true })
  authorId?: string | null

  @Field(() => String, { nullable: true })
  author?: string | null
}
