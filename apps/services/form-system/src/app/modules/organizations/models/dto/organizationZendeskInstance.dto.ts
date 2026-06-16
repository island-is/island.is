import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class OrganizationZendeskInstanceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zendeskInstance?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zendeskBrandId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizationId?: string
}
