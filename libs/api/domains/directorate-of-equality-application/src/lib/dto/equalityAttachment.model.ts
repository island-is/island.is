import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityEqualityAttachment')
export class EqualityAttachmentModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  filename!: string

  @Field(() => String)
  extension!: string

  @Field(() => Int)
  sizeBytes!: number

  @Field(() => Date)
  createdAt!: Date
}

@ObjectType('DirectorateOfEqualityPresignedUpload')
export class PresignedUploadModel {
  @Field(() => String)
  url!: string

  @Field(() => String)
  key!: string
}
