import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  zendeskId?: string
}
