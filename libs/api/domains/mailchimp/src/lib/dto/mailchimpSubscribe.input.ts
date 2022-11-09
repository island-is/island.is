import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@ObjectType()
class MailchimpInputField {
  @Field({ nullable: true })
  label?: string
  @Field({ nullable: true })
  value?: string
  @Field({ nullable: true })
  name?: string
}

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

  @Field(() => [Number], { nullable: true })
  categories?: Array<number>

  @Field(() => [MailchimpInputField], { nullable: true })
  inputFields?: Array<MailchimpInputField>
}
