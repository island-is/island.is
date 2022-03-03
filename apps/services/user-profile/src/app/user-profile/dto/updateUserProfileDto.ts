import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean,IsEnum, IsOptional, IsString } from 'class-validator'

import { DataStatus } from '../types/dataStatusTypes'
import { Locale } from '../types/localeTypes'

export class UpdateUserProfileDto {
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
  @IsString()
  @ApiPropertyOptional()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly email?: string

  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean

  @IsOptional()
  @IsBoolean()
  readonly mobilePhoneNumberVerified?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly documentNotifications?: boolean

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
