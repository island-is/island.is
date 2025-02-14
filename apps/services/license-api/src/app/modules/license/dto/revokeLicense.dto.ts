import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { LicenseApiVersion } from '../license.types'

export class RevokeLicenseResponse {
  @ApiProperty({ description: 'Has the license been revoked?' })
  @IsBoolean()
  readonly revokeSuccess!: boolean
}

export class RevokeLicenseRequest {
  @IsOptional()
  @ApiProperty({ description: 'Optional request id for logging purposes' })
  @IsString()
  readonly requestId?: string
}
