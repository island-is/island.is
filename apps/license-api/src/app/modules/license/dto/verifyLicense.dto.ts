import { ApiProperty } from '@nestjs/swagger'
import { LicenseId } from '../license.types'
import { IsEnum, IsJSON } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'

export class VerifyLicenseRequest {
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
  @ApiProperty({ description: 'PDF417 barcode scanner data' })
  @IsJSON()
  //Dont really need to verify, the proper service destination shall do that. Just need to check which type to know where to send
  readonly barcodeData!: string
}

export class VerifyLicenseResponse extends VerifyLicenseRequest {}
