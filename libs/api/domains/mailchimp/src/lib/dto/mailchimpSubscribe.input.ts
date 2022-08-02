import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class MailchimpSubscribeInput {
  @Field()
  signupID!: string

  @Field()
  @IsEmail()
  email!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  toggle?: boolean
}
