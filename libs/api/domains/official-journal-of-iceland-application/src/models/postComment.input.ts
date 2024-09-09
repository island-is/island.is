import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationPostCommentInput')
export class PostCommentInput {
  @Field(() => String, { description: 'Application ID' })
  id!: string

  @Field()
  comment!: string
}
