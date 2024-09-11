import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetPresignedUrlInput')
export class GetPresignedUrlInput {
  @Field()
  applicationId!: string

  @Field()
  fileName!: string

  @Field()
  fileType!: string

  @Field()
  attachmentType!: string
}
