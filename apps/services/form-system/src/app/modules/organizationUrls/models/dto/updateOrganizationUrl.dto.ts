import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateOrganizationUrlDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  url?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isXroad?: boolean

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  method?: string
}
