import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

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

  @ApiProperty()
  @IsBoolean()
  readonly mobilePhoneNumberVerified!: boolean

  @ApiProperty()
  @IsBoolean()
  readonly emailVerified!: boolean

  @ApiProperty()
  @IsBoolean()
  readonly documentNotifications!: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly profileImageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly needsNudge?: boolean | null

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean
}
