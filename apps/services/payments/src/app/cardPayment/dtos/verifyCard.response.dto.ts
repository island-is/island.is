import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

class VerificationField {
  @ApiProperty({ description: 'Field name', type: String })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Field value', type: String })
  @IsString()
  value!: string
}

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
  @IsBoolean()
  outOfScaScope!: boolean
}

export class VerifyCardResponse {
  @ApiProperty({
    description: 'Raw response from card verification',
    type: String,
  })
  @IsString()
  cardVerificationRawResponse!: string

  @ApiProperty({ description: 'Post URL for verification', type: String })
  @IsString()
  postUrl!: string

  @ApiProperty({
    description: 'Verification fields',
    type: [VerificationField],
  })
  @IsArray()
  verificationFields!: VerificationField[]

  @ApiProperty({ description: 'Additional fields', type: [VerificationField] })
  @IsArray()
  additionalFields!: VerificationField[]

  @ApiProperty({
    description: 'Indicates if the verification was successful',
    type: Boolean,
  })
  @IsBoolean()
  isSuccess!: boolean

  @ApiProperty({ description: 'Card information', type: CardInformation })
  @IsObject()
  cardInformation!: CardInformation

  @ApiProperty({ description: 'Script path for further actions', type: String })
  @IsString()
  scriptPath!: string

  @ApiProperty({
    description: 'Response code from the verification',
    type: String,
  })
  @IsString()
  responseCode!: string

  @ApiPropertyOptional({
    description: 'Description of the response',
    type: String,
  })
  @IsString()
  @IsOptional()
  responseDescription?: string

  @ApiProperty({
    description: 'Response time of the verification',
    type: String,
  })
  @IsString()
  responseTime!: string

  @ApiProperty({ description: 'Correlation ID for tracking', type: String })
  @IsString()
  correlationId!: string
}
