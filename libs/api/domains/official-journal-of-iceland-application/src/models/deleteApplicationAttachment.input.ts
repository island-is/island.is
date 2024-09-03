import { Field, InputType } from '@nestjs/graphql'

@InputType(
  'OfficialJournalOfIcelandApplicationDeleteApplicationAttachmentInput',
)
export class DeleteApplicationAttachmentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  key!: string
}
