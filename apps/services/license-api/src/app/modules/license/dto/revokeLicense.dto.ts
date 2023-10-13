import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class RevokeLicenseResponse {
  @ApiProperty({ description: 'Has the license been revoked?' })
  @IsBoolean()
  readonly revokeSuccess!: boolean

  @IsOptional()
  @ApiProperty({ description: 'Optional request id for logging purposes' })
  @IsString()
  readonly requestId?: string
}
