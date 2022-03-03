import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { DataStatus } from '../types/dataStatusTypes'
import { Locale } from '../types/localeTypes'

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly mobilePhoneNumber?: string

  @IsOptional()
  @IsString()
  @IsEnum(Locale)
  @ApiPropertyOptional()
  readonly locale?: Locale

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string

  @IsOptional()
  @IsBoolean()
  readonly mobilePhoneNumberVerified?: boolean

  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean

  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  readonly emailStatus?: DataStatus

  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  readonly mobileStatus?: DataStatus

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly emailCode?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly smsCode?: string
}
