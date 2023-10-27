import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { Locale } from '../../user-profile/types/localeTypes'

export class PatchUserProfileDto {
  @ApiPropertyOptional({
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((e) => e.email !== null)
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.email !== null)
  emailVerificationCode?: string

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @ValidateIf((e) => e.mobilePhoneNumber !== null)
  mobilePhoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.mobilePhoneNumber !== null)
  mobilePhoneNumberVerificationCode?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale
}
