import { Field, InputType } from '@nestjs/graphql'
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator'
import { Locale } from '../types/locales.enum'

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  // Temporary merge with islyklar service
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  canNudge?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bankInfo?: string
}
