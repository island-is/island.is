import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  @ApiPropertyOptional()
  readonly locale?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string
}
