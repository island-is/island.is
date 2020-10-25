import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
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
  @ApiPropertyOptional()
  readonly emailVerified?: boolean
}
