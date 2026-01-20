import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('OJOIAPostCommentInput')
export class PostCommentInput {
  @Field(() => ID)
  id!: string

  @Field()
  comment!: string

  @Field(() => String, { nullable: true })
  applicationUserName?: string
}
