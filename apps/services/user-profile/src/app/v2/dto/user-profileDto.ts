import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { DataType } from 'sequelize-typescript'
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  readonly nationalId: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly mobilePhoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(DataType.ENUM('en', 'is'))
  readonly locale?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(DataStatus)
  readonly mobileStatus?: DataStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(DataStatus)
  readonly emailStatus?: DataStatus

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsDate()
  readonly lastNudge?: Date
}
