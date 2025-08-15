import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { Locale } from '../types/localeTypes'

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  readonly nationalId!: string

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string | null

  @ApiPropertyOptional({
    type: () => String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readonly mobilePhoneNumber?: string | null

  @ApiPropertyOptional({ enum: Locale, type: () => Locale, nullable: true })
  @IsOptional()
  @IsEnum(Locale)
  readonly locale?: Locale | null

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

  @ApiPropertyOptional({
    type: () => Boolean,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly needsNudge?: boolean | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  readonly lastNudge?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  readonly nextNudge?: Date

  @ApiProperty()
  @IsBoolean()
  emailNotifications!: boolean

  @ApiProperty()
  @IsBoolean()
  readonly isRestricted?: boolean
}
