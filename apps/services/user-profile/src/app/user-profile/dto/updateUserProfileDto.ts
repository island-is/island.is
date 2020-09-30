import { IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobilePhoneNumber!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly locale?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly profileImageUrl?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly email?: string
}
