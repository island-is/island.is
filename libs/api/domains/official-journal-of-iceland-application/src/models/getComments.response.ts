import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum CommentDirection {
  SENT = 'sent',
  RECEIVED = 'received',
}

registerEnumType(CommentDirection, {
  name: 'OJOICommentDirection',
})

export enum CommentActionEnum {
  EXTERNAL = 'external',
  APPLICATION = 'application',
}

registerEnumType(CommentActionEnum, {
  name: 'OJOICommentActionEnum',
})

@ObjectType('OJOIAComment')
export class CaseComment {
  @Field(() => ID)
  id!: string

  @Field()
  age!: string

  @Field(() => CommentDirection)
  direction!: CommentDirection

  @Field(() => CommentActionEnum)
  action!: CommentActionEnum

  @Field(() => String, { nullable: true })
  comment!: string | null

  @Field(() => String)
  creator!: string

  @Field(() => String, { nullable: true })
  receiver!: string | null
}

@ObjectType('OJOIAGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
