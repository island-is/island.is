import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum CommentDirection {
  SENT = 'sent',
  RECEIVED = 'received',
}

registerEnumType(CommentDirection, {
  name: 'OJOICommentDirection',
})

@ObjectType('OJOIAComment')
export class CaseComment {
  @Field(() => ID)
  id!: string

  @Field()
  age!: string

  @Field(() => CommentDirection)
  direction!: CommentDirection

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  comment!: string | null

  @Field(() => String, { nullable: true })
  creator!: string | null

  @Field(() => String, { nullable: true })
  receiver!: string | null
}

@ObjectType('OJOIAGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
