import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
@InputType()
export class GetPresignedUrlInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  type!: string
}
