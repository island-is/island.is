import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationCommentTask')
export class CaseCommentTask {
  @Field(() => String, { nullable: true })
  from!: string | null

  @Field(() => String, { nullable: true })
  to!: string | null

  @Field()
  title!: string
  @Field(() => String, { nullable: true })
  comment!: string | null
}

@ObjectType('OfficialJournalOfIcelandApplicationComment')
export class CaseComment {
  @Field()
  id!: string

  @Field()
  createdAt!: string

  @Field()
  internal!: boolean

  @Field()
  type!: string

  @Field()
  caseStatus!: string

  @Field()
  state!: string

  @Field(() => CaseCommentTask)
  task!: CaseCommentTask
}

@ObjectType('OfficialJournalOfIcelandApplicationGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
