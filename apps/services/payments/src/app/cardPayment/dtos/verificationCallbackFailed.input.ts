import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

// A 3DS callback that arrived without authentication data (no cavv). Only
// non-sensitive outcome fields are passed on, for logging and the flow event.
export class VerificationCallbackFailedInput {
  @IsString()
  // A signed token of a few hundred characters, anything longer is not ours
  @MaxLength(1024)
  @ApiProperty({
    description: 'Encoded MD object with custom request data.',
    type: String,
  })
  md!: string

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiPropertyOptional({
    description: 'MD status from the gateway',
    type: String,
  })
  mdStatus?: string

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiPropertyOptional({
    description: 'Callback origin: Browser, Server or Fallback',
    type: String,
  })
  callbackSource?: string

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiPropertyOptional({ description: '3DS transaction status', type: String })
  transStatus?: string

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiPropertyOptional({
    description: '3DS transaction status reason',
    type: String,
  })
  transStatusReason?: string
}
