import { Field, InputType } from '@nestjs/graphql'

@InputType(
  'OfficialJournalOfIcelandApplicationDeleteApplicationAttachmentInput',
)
export class DeleteApplicationAttachmentInput {
  @Field()
  applicationId!: string

  @Field()
  key!: string
}
