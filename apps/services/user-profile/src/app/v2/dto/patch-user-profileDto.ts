import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'
import { Locale } from '../../user-profile/types/localeTypes'

export class PatchUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.email !== '')
  emailVerificationCode?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.mobilePhoneNumber !== '')
  mobilePhoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.mobilePhoneNumber !== '')
  mobilePhoneNumberVerificationCode?: string

  @ApiPropertyOptional({
    enum: Locale,
    enumName: 'Locale',
  })
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale
}
