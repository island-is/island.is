import { IsOptional, IsString, IsEmail } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateHelpdeskDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phoneNumber?: string
}
