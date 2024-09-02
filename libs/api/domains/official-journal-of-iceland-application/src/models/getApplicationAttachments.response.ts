import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetApplicationAttachments')
export class GetApplicationAttachmentsResponse {
  @Field(() => [GetApplicationAttachmentResponse])
  attachments!: GetApplicationAttachmentResponse[]
}

@ObjectType(
  'OfficialJournalOfIcelandApplicationGetApplicationAttachmentResponse',
)
export class GetApplicationAttachmentResponse {
  @Field(() => String)
  id!: string

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
