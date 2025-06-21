import { InputType } from '@nestjs/graphql'

import { Field } from '@nestjs/graphql'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

@InputType('UpdateActorProfileEmailInput')
export class UpdateActorProfileEmailInput {
  @Field(() => String)
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string

  @Field(() => String)
  @IsOptional()
  @IsString()
  emailVerificationCode?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean
}
