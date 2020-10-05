import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class AddAttachmentInput {
  @Field(() => String)
  @IsString()
  id: string

  @Field(() => String)
  @IsString()
  key: string

  @Field(() => String)
  @IsString()
  url: string
}
