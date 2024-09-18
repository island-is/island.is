import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationEntity')
export class CaseCommentEntity {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string
}
@ObjectType('OfficialJournalOfIcelandApplicationCommentTask')
export class CaseCommentTask {
  @Field(() => String, { nullable: true })
  from!: string | null

  @Field(() => String, { nullable: true })
  to!: string | null

  @Field(() => CaseCommentEntity)
  title!: CaseCommentEntity

  @Field(() => String, { nullable: true })
  comment!: string | null
}

@ObjectType('OfficialJournalOfIcelandApplicationComment')
export class CaseComment {
  @Field(() => ID)
  id!: string

  @Field()
  createdAt!: string

  @Field()
  internal!: boolean

  @Field(() => CaseCommentEntity)
  type!: CaseCommentEntity

  @Field(() => CaseCommentEntity)
  status!: CaseCommentEntity

  @Field(() => String, { nullable: true })
  state!: string | null

  @Field(() => CaseCommentTask)
  task!: CaseCommentTask
}

@ObjectType('OfficialJournalOfIcelandApplicationGetCommentsResponse')
export class GetCommentsResponse {
  @Field(() => [CaseComment])
  comments!: CaseComment[]
}
