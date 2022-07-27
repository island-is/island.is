import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class MailchimpSubscribeInput {
  @Field()
  @IsString()
  signupID!: string

  @Field()
  @IsEmail()
  email!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  toggle?: boolean
}
