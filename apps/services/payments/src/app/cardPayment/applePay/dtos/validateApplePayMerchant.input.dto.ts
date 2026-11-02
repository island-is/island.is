import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl } from 'class-validator'

export class ValidateApplePayMerchantInput {
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'Apple Pay validation URL from onvalidatemerchant event',
    type: String,
    example: 'https://apple-pay-gateway.apple.com/paymentservices/startSession',
  })
  validationURL!: string
}
