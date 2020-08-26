import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class AddAttachmentInput {
  @Field((type) => String)
  @IsString()
  id: string

  @Field((type) => String)
  @IsString()
  key: string

  @Field((type) => String)
  @IsString()
  url: string
}
