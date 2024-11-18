import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateOrganizationUrlDto {
  @IsString()
  @IsOptional()
  // @IsNotEmpty()
  @ApiPropertyOptional()
  url?: string

  @IsBoolean()
  // @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  isXroad?: boolean

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  method?: string
}
