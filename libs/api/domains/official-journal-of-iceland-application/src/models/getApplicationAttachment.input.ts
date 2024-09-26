import { InputType, Field } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetApplicationAttachmentInput')
export class GetApplicationAttachmentInput {
  @Field()
  applicationId!: string

  @Field()
  attachmentType!: string
}
