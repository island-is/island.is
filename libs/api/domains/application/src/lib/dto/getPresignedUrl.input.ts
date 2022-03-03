import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum,IsString } from 'class-validator'
@InputType()
export class GetPresignedUrlInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  type!: string
}
