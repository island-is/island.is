import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationUploadAttachmentsResponse')
export class UploadAttachmentsResponse {
  @Field(() => [UploadAttachment])
  files!: UploadAttachment[]
}

@ObjectType('OfficialJournalOfIcelandApplicationUploadAttachment')
export class UploadAttachment {
  @Field(() => String)
  filename!: string

  @Field(() => String)
  url!: string

  @Field(() => Number)
  size!: number
}
