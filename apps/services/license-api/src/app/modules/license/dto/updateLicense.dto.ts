import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
} from 'class-validator'
import { LicenseApiVersion, LicenseUpdateType } from '../license.types'

export class UpdateLicenseRequest {
  @ApiProperty({ enum: LicenseUpdateType, description: 'The update action' })
  @IsEnum(LicenseUpdateType)
  readonly licenseUpdateType!: LicenseUpdateType

  @ApiPropertyOptional({ description: 'The expiration date of the license' })
  @IsOptional()
  @IsISO8601()
  readonly expiryDate?: string

  @ApiPropertyOptional({ description: 'Data to be updated' })
  @IsOptional()
  @IsJSON()
  //will be validated in a specific service later! we do not care whats in here as of now, or will we?
  readonly payload?: string

  @IsOptional()
  @ApiProperty({ description: 'Optional request id for logging purposes' })
  @IsString()
  readonly requestId?: string
}

export class UpdateLicenseResponse {
  @ApiProperty()
  @IsBoolean()
  readonly updateSuccess!: boolean
  @ApiPropertyOptional()
  readonly data?: unknown
}
