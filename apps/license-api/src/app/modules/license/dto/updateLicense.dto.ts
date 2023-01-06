import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsEnum, IsISO8601 } from 'class-validator'
import { LicenseId, LicenseUpdateType, LicenseStatus } from '../license.types'
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

  @ApiProperty({ enum: LicenseStatus })
  @IsEnum(LicenseStatus)
  readonly licenseStatus!: LicenseStatus

  @ApiProperty()
  @IsISO8601()
  readonly expiryDate!: string

  @ApiPropertyOptional({ description: 'Data to be updated' })
  //will be validated in a specific service later! we do not care whats in here as of now
  readonly payload?: unknown
}
export class UpdateLicenseResponse extends OmitType(UpdateLicenseRequest, [
  'licenseUpdateType',
]) {}

export class PushUpdateLicenseDto extends UpdateLicenseRequest {}
export class PullUpdateLicenseDto extends OmitType(UpdateLicenseRequest, [
  'licenseStatus',
  'expiryDate',
  'payload',
]) {}
