import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { Locale } from '../types/locales.enum'

@InputType()
export class CreateUserProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  locale?: Locale

  @Field(() => String, { nullable: true })
  @IsOptional()
  email?: string

  // Temporary merge with islyklar service
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  canNudge?: boolean
}
