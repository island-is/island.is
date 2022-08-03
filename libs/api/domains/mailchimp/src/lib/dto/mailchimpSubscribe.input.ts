import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

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
