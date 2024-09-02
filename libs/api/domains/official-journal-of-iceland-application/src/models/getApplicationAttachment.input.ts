import { InputType, Field } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetApplicationAttachmentInput')
export class GetApplicationAttachmentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  attachmentType!: string
}
