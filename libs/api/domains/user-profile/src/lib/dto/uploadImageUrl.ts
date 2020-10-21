import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class UploadImageUrl {
  @Field(() => String)
  @IsString()
  uploadUrl!: string
}
