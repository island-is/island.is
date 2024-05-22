import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationPostCommentBody')
export class PostCommentBody {
  @Field(() => String)
  comment!: string
}

@InputType('OfficialJournalOfIcelandApplicationPostCommentInput')
export class PostCommentInput {
  @Field(() => String, { description: 'Application ID' })
  id!: string

  @Field(() => PostCommentBody)
  postApplicationComment!: PostCommentBody
}
