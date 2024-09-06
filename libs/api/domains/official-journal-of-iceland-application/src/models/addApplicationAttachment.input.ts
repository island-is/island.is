import { InputType, Field, Int } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationAddApplicationAttachmentInput')
export class AddApplicationAttachmentInput {
  @Field()
  applicationId!: string

  @Field()
  attachmentType!: string

  @Field()
  fileName!: string

  @Field()
  originalFileName!: string

  @Field()
  fileFormat!: string

  @Field()
  fileExtension!: string

  @Field()
  fileLocation!: string

  @Field(() => Int)
  fileSize!: number
}
