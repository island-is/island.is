import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateMessageAttachmentInput {
  @Field()
  fileName!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  contentType!: string

  @Field()
  contentBase64!: string
}
