import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'

// Define the structure of the URLs
class PaymentUrls {
  @ApiProperty({
    description: 'URL for Icelandic locale',
    type: String,
    example: 'https://www.island.is/greida/is/:id',
  })
  @IsOptional()
  @IsString()
  is!: string

  @ApiProperty({
    description: 'URL for English locale',
    type: String,
    example: 'https://www.island.is/greida/en/:id',
  })
  @IsOptional()
  @IsString()
  en!: string
}

// Main DTO for the CreatePaymentFlow response
export class CreatePaymentFlowDTO {
  @ApiProperty({
    description: 'Unique identifier for the payment flow',
    type: String,
    format: 'uuid',
  })
  id!: string

  @ApiProperty({
    description: 'Localized URLs for payment flow initiation',
    type: PaymentUrls,
    example: {
      is: 'https://www.island.is/greida/is/:id',
      en: 'https://www.island.is/greida/en/:id',
    },
  })
  @IsObject()
  urls!: PaymentUrls
}
