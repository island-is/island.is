import { InputType, Field, Int } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationAddApplicationAttachmentInput')
export class AddApplicationAttachmentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  attachmentType!: string

  @Field(() => String)
  fileName!: string

  @Field(() => String)
  originalFileName!: string

  @Field(() => String)
  fileFormat!: string

  @Field(() => String)
  fileExtension!: string

  @Field(() => String)
  fileLocation!: string

  @Field(() => Int)
  fileSize!: number
}
