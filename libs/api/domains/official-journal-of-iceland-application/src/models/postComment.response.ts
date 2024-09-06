import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationPostCommentResponse')
export class PostCommentResponse {
  @Field()
  success!: boolean
}
