import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export * from './revokeLicense.dto'
export * from './updateLicense.dto'
export * from './verifyLicense.dto'

export class LicenseError {
  @ApiProperty()
  readonly code!: string
  @ApiProperty()
  readonly message!: string
  @ApiPropertyOptional()
  readonly data?: unknown
}
