import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
@InputType()
export class FileContentAsBase64Input {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  key!: string
}
