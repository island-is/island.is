import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum CaseCommentTypeEnum {
  EXTERNAL_COMMENT = 'EXTERNAL_COMMENT',
  APPLICATION_COMMENT = 'APPLICATION_COMMENT',
}

registerEnumType(CaseCommentTypeEnum, {
  name: 'OJOIACommentTypeEnum',
})

@ObjectType('OJOIAComment')
export class CaseComment {
  @Field(() => ID)
  id!: string

  @Field()
  age!: string

  @Field()
  creator!: string

  @Field(() => String, { nullable: true })
  comment!: string | null

  @Field(() => CaseCommentTypeEnum)
  action!: CaseCommentTypeEnum
}

@ObjectType('OJOIAGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
