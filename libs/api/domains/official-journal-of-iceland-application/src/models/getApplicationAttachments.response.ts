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
  @Field()
  id!: string

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
