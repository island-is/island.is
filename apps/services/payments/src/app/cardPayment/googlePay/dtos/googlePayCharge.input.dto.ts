import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'

import { VerifyCardBrowserInfo } from '../../card/dtos'
import { GooglePayChargeVerifiedInput } from './googlePayChargeVerified.input.dto'

export class GooglePayChargeInput extends GooglePayChargeVerifiedInput {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({
    description:
      'Name from the Google Pay billing address, forwarded to the payment gateway when a saved card goes through 3-D Secure',
    type: String,
  })
  cardholderName?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => VerifyCardBrowserInfo)
  @ApiPropertyOptional({
    description:
      'Browser environment of the payer, forwarded to the payment gateway when a saved card goes through 3-D Secure',
    type: VerifyCardBrowserInfo,
  })
  browserInfo?: VerifyCardBrowserInfo
}
