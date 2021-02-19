import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  endpoint?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  endpointType?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  apiScope?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  xroad?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  externalProviderId?: string
}
