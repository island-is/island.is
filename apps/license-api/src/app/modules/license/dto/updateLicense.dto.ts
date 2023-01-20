import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
} from 'class-validator'
import { LicenseId, LicenseUpdateType } from '../license.types'
import { IsNationalId } from '@island.is/nest/validators'

export class UpdateLicenseRequest {
  @ApiProperty({
    description: 'Valid Icelandic national id, exactly 10 numbers as a string',
  })
  @IsNationalId({ message: 'Invalid national id' })
  readonly nationalId!: string
  @ApiProperty({
    enum: LicenseId,
    description: 'The Id of a license as defined by island.is',
  })
  @IsEnum(LicenseId)
  readonly licenseId!: LicenseId

  @ApiProperty({ enum: LicenseUpdateType, description: 'The update action' })
  @IsEnum(LicenseUpdateType)
  readonly licenseUpdateType!: LicenseUpdateType

  @ApiPropertyOptional({ description: 'The expiration date of the license' })
  @IsISO8601()
  readonly expiryDate?: string

  @ApiPropertyOptional({ description: 'Data to be updated' })
  @IsOptional()
  @IsJSON()
  //will be validated in a specific service later! we do not care whats in here as of now, or will we?
  readonly payload?: string
}
export class UpdateLicenseResponse {
  @ApiProperty()
  @IsBoolean()
  readonly updateSuccess!: boolean
  @ApiPropertyOptional()
  readonly data?: unknown
}
