import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phoneNumber?: string
}
