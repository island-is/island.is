import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class UploadImageUrlInput {
  @Field(() => String)
  @IsString()
  uploadUrl!: string
}
