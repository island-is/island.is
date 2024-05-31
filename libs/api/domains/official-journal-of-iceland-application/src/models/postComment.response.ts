import { Field, ObjectType } from '@nestjs/graphql'
import { CaseComment } from './getComments.response'

@ObjectType('OfficialJournalOfIcelandApplicationPostCommentResponse')
export class PostCommentResponse {
  @Field(() => CaseComment)
  comment!: CaseComment
}
