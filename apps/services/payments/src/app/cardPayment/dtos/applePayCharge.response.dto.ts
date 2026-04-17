import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'

import { CardInformation } from './CardInformation.dto'

export class ApplePayChargeResponse {
  @ApiProperty({ description: 'Acquirer reference number', type: String })
  @IsString()
  acquirerReferenceNumber!: string

  @ApiProperty({ description: 'Transaction ID', type: String })
  @IsString()
  transactionID!: string

  @ApiProperty({ description: 'Authorization code', type: String })
  @IsString()
  authorizationCode!: string

  @ApiProperty({ description: 'Transaction lifecycle ID', type: String })
  @IsString()
  transactionLifecycleId!: string

  @ApiProperty({ description: 'Masked card number', type: String })
  @IsString()
  maskedCardNumber!: string

  @ApiProperty({
    description: 'Indicates if the transaction was successful',
    type: Boolean,
  })
  @IsBoolean()
  isSuccess!: boolean

  @ApiProperty({ description: 'Card information', type: CardInformation })
  @IsObject()
  cardInformation!: CardInformation

  @ApiProperty({ description: 'Authorization identifier', type: String })
  @IsString()
  authorizationIdentifier!: string

  @ApiProperty({ description: 'Response code from the charge', type: String })
  @IsString()
  responseCode!: string

  @ApiPropertyOptional({
    description: 'Description of the response',
    type: String,
  })
  @IsString()
  @IsOptional()
  responseDescription?: string

  @ApiProperty({ description: 'Response time of the charge', type: String })
  @IsString()
  responseTime!: string

  @ApiProperty({ description: 'Correlation ID for tracking', type: String })
  @IsString()
  correlationId!: string
}
