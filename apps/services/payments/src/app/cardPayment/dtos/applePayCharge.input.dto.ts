import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsObject, ValidateNested } from 'class-validator'

class ApplePayPaymentHeader {
  @IsString()
  @ApiProperty({ description: 'Ephemeral public key', type: String })
  ephemeralPublicKey!: string

  @IsString()
  @ApiProperty({ description: 'Public key hash', type: String })
  publicKeyHash!: string

  @IsString()
  @ApiProperty({ description: 'Transaction ID', type: String })
  transactionId!: string
}

class ApplePayPaymentData {
  @IsString()
  @ApiProperty({ description: 'Version', type: String })
  version!: string

  @IsString()
  @ApiProperty({ description: 'Data', type: String })
  data!: string

  @IsString()
  @ApiProperty({ description: 'Signature', type: String })
  signature!: string

  @IsObject()
  @ValidateNested()
  @Type(() => ApplePayPaymentHeader)
  @ApiProperty({ description: 'Header', type: ApplePayPaymentHeader })
  header!: ApplePayPaymentHeader
}

class ApplePayPaymentMethod {
  @IsString()
  @ApiProperty({ description: 'Display name', type: String })
  displayName!: string

  @IsString()
  @ApiProperty({ description: 'Network', type: String })
  network!: string
}

export class ApplePayChargeInput {
  @IsString()
  @ApiProperty({ description: 'Payment flow ID', type: String })
  paymentFlowId!: string

  @IsObject()
  @ValidateNested()
  @Type(() => ApplePayPaymentData)
  @ApiProperty({ description: 'Payment data', type: ApplePayPaymentData })
  paymentData!: ApplePayPaymentData

  @IsObject()
  @ValidateNested()
  @Type(() => ApplePayPaymentMethod)
  @ApiProperty({ description: 'Payment method', type: ApplePayPaymentMethod })
  paymentMethod!: ApplePayPaymentMethod

  @IsString()
  @ApiProperty({ description: 'Transaction identifier', type: String })
  transactionIdentifier!: string
}
