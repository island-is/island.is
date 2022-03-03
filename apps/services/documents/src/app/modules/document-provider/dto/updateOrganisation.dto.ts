import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateOrganisationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  address?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phoneNumber?: string
}
