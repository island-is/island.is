import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

@InputType()
export class MailchimpSubscribeInput {
  @Field()
  @IsString()
  signupID!: string

  @Field()
  @IsString()
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
