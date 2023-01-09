import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum } from 'class-validator'
import { LicenseId } from '../license.types'
import { IsNationalId } from '@island.is/nest/validators'

export class RevokeLicenseRequest {
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
}

export class RevokeLicenseResponse {
  @ApiProperty({ description: 'Has the license been revoked?' })
  @IsBoolean()
  readonly revokeSuccess!: boolean
}
