import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class ContactUsInput {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  phone: string

  @Field()
  @IsString()
  email: string

  @Field()
  @IsString()
  subject: string

  @Field()
  @IsString()
  message: string
}
