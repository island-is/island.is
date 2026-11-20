import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator'

import { CardInformation } from '../../dtos/CardInformation.dto'

export class ApplePayChargeResponse {
  @ApiProperty({ description: 'Acquirer reference number', type: String })
  @IsString()
  acquirerReferenceNumber!: string

  @ApiPropertyOptional({ description: 'Transaction ID', type: String })
  @IsString()
  @IsOptional()
  transactionID?: string

  @ApiProperty({ description: 'Authorization code', type: String })
  @IsString()
  authorizationCode!: string

  @ApiPropertyOptional({
    description: 'Transaction lifecycle ID',
    type: String,
  })
  @IsString()
  @IsOptional()
  transactionLifecycleId?: string

  @ApiProperty({
    description: 'Masked card number returned by the payment gateway',
    type: String,
  })
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

  @ApiPropertyOptional({
    description: 'Authorization identifier',
    type: String,
  })
  @IsString()
  @IsOptional()
  authorizationIdentifier?: string

  @ApiPropertyOptional({
    description: 'Response code from the charge',
    type: String,
  })
  @IsString()
  @IsOptional()
  responseCode?: string

  @ApiPropertyOptional({
    description: 'Description of the response',
    type: String,
  })
  @IsString()
  @IsOptional()
  responseDescription?: string

  @ApiPropertyOptional({
    description: 'Response time of the charge',
    type: String,
  })
  @IsString()
  @IsOptional()
  responseTime?: string

  @ApiProperty({ description: 'Correlation ID for tracking', type: String })
  @IsString()
  correlationId!: string
}
