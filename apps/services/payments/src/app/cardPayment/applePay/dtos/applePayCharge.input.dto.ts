import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator'

class ApplePayPaymentHeader {
  @IsString()
  @MaxLength(256)
  @ApiProperty({
    description: 'Ephemeral public key (SPKI base64)',
    type: String,
  })
  ephemeralPublicKey!: string

  @IsString()
  @Length(1, 128)
  @ApiProperty({
    description: 'Public key hash (SHA-256 base64)',
    type: String,
  })
  publicKeyHash!: string

  @IsString()
  @Matches(/^[a-fA-F0-9]{64}$/)
  @ApiProperty({
    description:
      'Apple Pay device transaction id: exactly 64 hex chars (32 bytes). Apple emits a SHA-256-derived value here. The strict format prevents odd-length truncation in Buffer.from(s, "hex") from producing two distinct strings that decode to the same bytes — which would otherwise weaken digest binding and replay-cache lookups.',
    type: String,
  })
  transactionId!: string

  @IsOptional()
  @IsString()
  @MaxLength(8192)
  @ApiPropertyOptional({
    description:
      'Optional merchant-supplied application data (base64). Included in the signed bytes per PassKit spec.',
    type: String,
  })
  applicationData?: string
}

class ApplePayPaymentData {
  @IsString()
  @IsIn(['EC_v1'])
  @ApiProperty({ description: 'Token version', type: String })
  version!: string

  @IsString()
  @MaxLength(8192)
  @ApiProperty({ description: 'Encrypted payment data (base64)', type: String })
  data!: string

  @IsString()
  @MaxLength(16384)
  @ApiProperty({
    description: 'Detached PKCS#7 signature (base64)',
    type: String,
  })
  signature!: string

  @IsObject()
  @ValidateNested()
  @Type(() => ApplePayPaymentHeader)
  @ApiProperty({ description: 'Header', type: ApplePayPaymentHeader })
  header!: ApplePayPaymentHeader
}

export class ApplePayChargeInput {
  @IsString()
  @Length(1, 128)
  @ApiProperty({ description: 'Payment flow ID', type: String })
  paymentFlowId!: string

  @IsObject()
  @ValidateNested()
  @Type(() => ApplePayPaymentData)
  @ApiProperty({ description: 'Payment data', type: ApplePayPaymentData })
  paymentData!: ApplePayPaymentData

  @IsString()
  @Matches(/^[a-fA-F0-9]{64}$/)
  @ApiProperty({
    description:
      "Apple Pay transaction identifier: exactly 64 hex chars (32 bytes). Used as a replay-protection cache key. Strict format matches Apple's canonical transactionId so two formatting variants can never bypass replay detection.",
    type: String,
  })
  transactionIdentifier!: string
}
