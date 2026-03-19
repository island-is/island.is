import { Field, InputType } from '@nestjs/graphql'
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  ValidateIf,
} from 'class-validator'
import { Locale } from '../types/locales.enum'
import { DataStatus } from '../types/dataStatus.enum'

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
  @ValidateIf((e) => e.email !== '')
  @IsEmail()
  email?: string

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  documentNotifications?: boolean

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean

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
