import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { DataType } from 'sequelize-typescript'
import { Locale } from '../../user-profile/types/localeTypes'

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  readonly nationalId: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly mobilePhoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Locale)
  readonly locale?: Locale

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly mobilePhoneNumberVerified?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly emailVerified?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly documentNotifications?: boolean
}
