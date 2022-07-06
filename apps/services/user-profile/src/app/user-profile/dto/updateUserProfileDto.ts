import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Locale } from '../types/localeTypes'
import { DataStatus } from '../types/dataStatusTypes'

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
  @ApiPropertyOptional()
  readonly emailStatus?: DataStatus

  @IsOptional()
  @IsString()
  @IsEnum(DataStatus)
  @ApiPropertyOptional()
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
