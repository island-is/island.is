import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Locale } from '../types/localeTypes'
import { DataStatus } from '../types/dataStatusTypes'

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
