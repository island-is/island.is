import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsIn,
  IsObject,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator'

class ApplePayPaymentHeader {
  @IsString()
  @MaxLength(256)
  @ApiProperty({ description: 'Ephemeral public key (SPKI base64)', type: String })
  ephemeralPublicKey!: string

  @IsString()
  @Length(1, 128)
  @ApiProperty({ description: 'Public key hash (SHA-256 base64)', type: String })
  publicKeyHash!: string

  @IsString()
  @Matches(/^[a-fA-F0-9]{1,128}$/)
  @ApiProperty({ description: 'Apple Pay device transaction id (hex)', type: String })
  transactionId!: string
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
  @ApiProperty({ description: 'Detached PKCS#7 signature (base64)', type: String })
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
  @Matches(/^[a-fA-F0-9]{1,128}$/)
  @ApiProperty({
    description:
      'Apple Pay transaction identifier (hex). Used as a replay-protection cache key.',
    type: String,
  })
  transactionIdentifier!: string
}
