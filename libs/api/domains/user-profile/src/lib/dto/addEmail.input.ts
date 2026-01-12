import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class AddEmailInput {
  @Field(() => String)
  @IsEmail()
  email!: string

  @Field(() => String)
  @IsString()
  @MaxLength(3)
  @MinLength(3)
  code!: string
}
