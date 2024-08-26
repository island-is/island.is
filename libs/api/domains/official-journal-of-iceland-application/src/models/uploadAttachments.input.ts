import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationUploadAttachmentsInput')
export class UploadAttachmentsInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  base64!: string
}
