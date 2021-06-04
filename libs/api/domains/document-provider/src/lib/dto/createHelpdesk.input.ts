import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, IsOptional } from 'class-validator'

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
