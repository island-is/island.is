import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType(
  'OfficialJournalOfIcelandApplicationAddApplicationAttachmentResponse',
)
export class AddApplicationAttachmentResponse {
  @Field(() => Boolean)
  success!: boolean
}
