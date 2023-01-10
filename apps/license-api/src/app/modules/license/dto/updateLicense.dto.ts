import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsISO8601 } from 'class-validator'
import {
  LicenseId,
  LicenseUpdateType,
  LicenseStatus,
  DateSchema,
} from '../license.types'
import { IsNationalId } from '@island.is/nest/validators'
import { z } from 'zod'

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

  @ApiPropertyOptional({ enum: LicenseStatus })
  @IsEnum(LicenseStatus)
  readonly licenseStatus?: LicenseStatus

  @ApiPropertyOptional()
  @IsISO8601()
  readonly expiryDate?: string

  @ApiPropertyOptional({ description: 'Data to be updated' })
  //will be validated in a specific service later! we do not care whats in here as of now
  readonly payload?: string
}
export class UpdateLicenseResponse {
  @ApiProperty()
  @IsBoolean()
  readonly updateSuccess!: boolean
  @ApiPropertyOptional()
  readonly data?: unknown
}
export const LicenseUpdateUnion = z.discriminatedUnion('licenseUpdateType', [
  z.object({
    licenseUpdateType: z.literal('push'),
    nationalId: z.number(),
    status: z.enum(['expired', 'ok', 'revoked', 'none']),
    //parse string into date
    expiryDate: DateSchema,
    payload: z.any(),
  }),
  z.object({
    licenseUpdateType: z.literal('pull'),
    nationalId: z.number(),
  }),
])

export type LicenseUpdateUnion = z.infer<typeof LicenseUpdateUnion>
