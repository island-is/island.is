import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationCommentTask')
export class CaseCommentTask {
  @Field(() => String, { nullable: true })
  from!: string | null

  @Field(() => String, { nullable: true })
  to!: string | null

  @Field(() => String)
  title!: string
  @Field(() => String, { nullable: true })
  comment!: string | null
}

@ObjectType('OfficialJournalOfIcelandApplicationComment')
export class CaseComment {
  @Field(() => String)
  id!: string

  @Field(() => String)
  createdAt!: string

  @Field(() => Boolean)
  internal!: boolean

  @Field(() => String)
  type!: string

  @Field(() => String)
  caseStatus!: string

  @Field(() => String)
  state!: string

  @Field(() => CaseCommentTask)
  task!: CaseCommentTask
}

@ObjectType('OfficialJournalOfIcelandApplicationGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
