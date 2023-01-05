import { ApiProperty } from '@nestjs/swagger'
import { Length, IsEnum, Validate } from 'class-validator'
import { LicenseId } from '../license.types'
import { ValidNationalId } from '../validation/validNationalId'

export class RevokeLicenseRequest {
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
}

export class RevokeLicenseResponse extends RevokeLicenseRequest {}
