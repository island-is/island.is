import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail,IsOptional, IsString } from 'class-validator'

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
