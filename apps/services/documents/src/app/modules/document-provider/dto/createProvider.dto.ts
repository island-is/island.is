import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly organisationId!: string

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
