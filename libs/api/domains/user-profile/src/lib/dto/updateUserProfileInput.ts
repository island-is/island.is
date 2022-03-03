import { Field, InputType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { DataStatus } from '../types/dataStatus.enum'
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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  documentNotifications?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  emailStatus?: DataStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  mobileStatus?: DataStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  emailCode?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  smsCode?: string

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
