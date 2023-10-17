import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator'

export class PatchUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((e) => e.mobilePhoneNumber !== '')
  mobilePhoneNumber?: string
}
