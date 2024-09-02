import { Field, InputType } from '@nestjs/graphql'

@InputType('OfficialJournalOfIcelandApplicationGetPresignedUrlInput')
export class GetPresignedUrlInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  fileName!: string

  @Field(() => String)
  fileType!: string

  @Field(() => String)
  attachmentType!: string
}
