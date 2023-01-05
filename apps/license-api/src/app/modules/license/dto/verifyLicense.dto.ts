import { ApiProperty } from '@nestjs/swagger'
import { LicenseId } from '../license.types'
import { IsEnum, IsJSON, Validate } from 'class-validator'
import { ValidNationalId } from '../validation/validNationalId'

export class VerifyLicenseRequest {
  @ApiProperty({
    description: 'Valid Icelandic national id, exactly 10 numbers as a string',
  })
  @Validate(ValidNationalId, { message: 'Invalid national id' })
  readonly nationalId!: string
  @ApiProperty({
    enum: LicenseId,
    description: 'The Id of a license as defined by island.is',
  })
  @IsEnum(LicenseId)
  readonly licenseId!: LicenseId
  @ApiProperty({ description: 'PDF417 barcode scanner data' })
  @IsJSON()
  readonly barcodeData!: string
}

export class VerifyLicenseResponse extends VerifyLicenseRequest {}
