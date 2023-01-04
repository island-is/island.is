import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'
import { LicenseId, LicenseStatus, LicenseUpdateType } from '../license.types'

export class DeleteLicenseDto {
  @ApiProperty()
  @IsString()
  @Length(10)
  readonly nationalId!: string
  @ApiProperty({
    enum: LicenseId,
    description: 'The Id of a license as defined by island.is',
  })
  @IsString()
  readonly licenseId!: LicenseId
}

export class UpdateLicenseDto {
  @ApiProperty()
  @IsString()
  @Length(10)
  readonly nationalId!: string
  @ApiProperty({
    enum: LicenseId,
    description: 'The Id of a license as defined by island.is',
  })
  @IsString()
  readonly licenseId!: LicenseId
  @ApiProperty({ enum: LicenseUpdateType })
  @IsString()
  readonly licenseUpdateType!: LicenseUpdateType
  @ApiProperty({ enum: LicenseStatus })
  @IsString()
  readonly licenseStatus!: LicenseStatus
  @ApiProperty()
  @IsString()
  readonly expiryDate!: string
  @ApiPropertyOptional()
  readonly payload?: unknown
}

export class PushUpdateLicenseDto extends UpdateLicenseDto {}
export class PullUpdateLicenseDto extends OmitType(UpdateLicenseDto, [
  'licenseStatus',
  'expiryDate',
  'payload',
]) {}
