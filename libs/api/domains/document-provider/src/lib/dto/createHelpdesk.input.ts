import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional,IsString } from 'class-validator'

@InputType()
export class CreateHelpdeskInput {
  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email?: string

  @Field(() => String)
  @IsString()
  @IsOptional()
  phoneNumber?: string
}
