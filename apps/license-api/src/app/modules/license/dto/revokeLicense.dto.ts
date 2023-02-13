import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class RevokeLicenseResponse {
  @ApiProperty({ description: 'Has the license been revoked?' })
  @IsBoolean()
  readonly revokeSuccess!: boolean
}
