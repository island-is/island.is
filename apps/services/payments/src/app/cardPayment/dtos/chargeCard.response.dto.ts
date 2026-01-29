import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsObject, IsString } from 'class-validator'

class CardInformation {
  @ApiProperty({
    description: 'Card scheme (for example Visa or MasterCard)',
    type: String,
  })
  @IsString()
  cardScheme!: string

  @ApiProperty({ description: 'Issuing country of the card', type: String })
  @IsString()
  issuingCountry!: string

  @ApiProperty({ description: 'Card usage description', type: String })
  @IsString()
  cardUsage!: string

  @ApiProperty({ description: 'Card category', type: String })
  @IsString()
  cardCategory!: string

  @ApiProperty({ description: 'Out-of-SCA scope status', type: Boolean })
  @IsString()
  outOfScaScope!: boolean
}

export class ChargeCardResponse {
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

  @ApiProperty({ description: 'Description of the response', type: String })
  @IsString()
  responseDescription?: string

  @ApiProperty({ description: 'Response time of the charge', type: String })
  @IsString()
  responseTime!: string

  @ApiProperty({ description: 'Correlation ID for tracking', type: String })
  @IsString()
  correlationId!: string
}
