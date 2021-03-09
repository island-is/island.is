import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

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
