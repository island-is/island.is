import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationPostCommentInput')
export class PostCommentInput {
  @Field(() => ID)
  id!: string

  @Field()
  comment!: string
}
