import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator'

export class PatchUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(7, 7)
  @ValidateIf((e) => e.mobilePhoneNumber !== '')
  mobilePhoneNumber?: string
}
