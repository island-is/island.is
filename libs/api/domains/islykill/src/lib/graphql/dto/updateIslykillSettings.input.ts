import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateIslykillSettingsInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mobile?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  canNudge?: boolean
}
