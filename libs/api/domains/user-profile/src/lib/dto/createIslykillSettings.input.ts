import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional } from 'class-validator'

@InputType()
export class CreateIslykillSettingsInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  mobile?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  canNudge?: boolean
}
