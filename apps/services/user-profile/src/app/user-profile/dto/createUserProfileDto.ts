import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Locale } from '@island.is/api/domains/user-profile'

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
  @IsString()
  @ApiPropertyOptional()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string
}
