import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AttachmentPresignedUrlInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  attachmentKey!: string
}
