import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'

/**
 * Browser environment of the payer, forwarded to the payment gateway as the
 * EMV 3-D Secure browser data of the authentication request. Screen dimensions
 * and similar fields are collected in the payer's browser; ip, userAgent and
 * acceptHeader are derived server-side from the payer's request by the API layer.
 *
 * Validation here is deliberately looser than the gateway contract: values that
 * cannot be forwarded as-is (e.g. an unsupported colorDepth) are normalised or
 * omitted when the gateway request is built, so an odd browser value can never
 * fail the verification outright.
 */
export class VerifyCardBrowserInfo {
  @IsInt()
  @Min(0)
  @Max(999999)
  @ApiProperty({
    description: 'Total height of the payer screen in pixels',
    type: Number,
  })
  screenHeight!: number

  @IsInt()
  @Min(0)
  @Max(999999)
  @ApiProperty({
    description: 'Total width of the payer screen in pixels',
    type: Number,
  })
  screenWidth!: number

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Colour depth of the payer screen in bits per pixel',
    type: Number,
  })
  colorDepth?: number

  @IsOptional()
  @IsInt()
  @Min(-99999)
  @Max(99999)
  @ApiPropertyOptional({
    description:
      'Offset in minutes between UTC and the payer browser local time',
    type: Number,
  })
  timeZoneOffset?: number

  @IsOptional()
  @IsString()
  @MaxLength(35)
  @ApiPropertyOptional({
    description: 'Browser language tag, e.g. is or en-GB',
    type: String,
  })
  language?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Whether the payer browser is able to execute Java',
    type: Boolean,
  })
  javaEnabled?: boolean

  @IsOptional()
  @IsString()
  @MaxLength(45)
  @ApiPropertyOptional({
    description: 'IP address of the payer as seen by the API layer',
    type: String,
  })
  ipAddress?: string

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiPropertyOptional({
    description: 'User-agent header of the payer request',
    type: String,
  })
  userAgent?: string

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiPropertyOptional({
    description: 'Accept header of the payer request',
    type: String,
  })
  acceptHeader?: string
}

export class VerifyCardInput {
  @IsString()
  @ApiProperty({
    description: 'Id of the related payment flow being paid',
    type: String,
  })
  paymentFlowId!: string

  @IsString()
  @ApiProperty({
    description: 'Card number',
    type: String,
  })
  cardNumber!: string

  @IsNumber()
  @ApiProperty({
    description: 'Card expiry month',
    type: Number,
  })
  expiryMonth!: number

  @IsNumber()
  @ApiProperty({
    description: 'Card expiry year',
    type: Number,
  })
  expiryYear!: number

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({
    description:
      'Cardholder name as printed on the card, forwarded to the payment gateway for 3-D Secure authentication',
    type: String,
  })
  cardholderName?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => VerifyCardBrowserInfo)
  @ApiPropertyOptional({
    description:
      'Browser environment of the payer, forwarded to the payment gateway for 3-D Secure authentication',
    type: VerifyCardBrowserInfo,
  })
  browserInfo?: VerifyCardBrowserInfo
}
