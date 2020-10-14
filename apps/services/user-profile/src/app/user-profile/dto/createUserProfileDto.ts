import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LocaleTypes } from '../types/localeTypes'

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
  @IsEnum(LocaleTypes)
  @ApiProperty({ enum: LocaleTypes, enumName: 'LocalTypes' })
  @ApiPropertyOptional()
  readonly locale?: LocaleTypes

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string
}
