import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationPostCommentBody')
export class PostCommentBody {
  @Field(() => String)
  from!: string

  @Field(() => String)
  comment!: string

  @Field(() => String, {
    nullable: true,
    description: 'Optional name of the employee making the comment',
  })
  name?: string
}

@InputType('OfficialJournalOfIcelandApplicationPostCommentInput')
export class PostCommentInput {
  @Field(() => String, { description: 'Application ID' })
  id!: string

  @Field(() => PostCommentBody)
  postApplicationComment!: PostCommentBody
}
