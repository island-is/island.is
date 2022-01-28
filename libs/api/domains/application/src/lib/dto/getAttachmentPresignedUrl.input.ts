import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
@InputType()
export class GetAttachmentPresignedUrlInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  s3key!: string
}
