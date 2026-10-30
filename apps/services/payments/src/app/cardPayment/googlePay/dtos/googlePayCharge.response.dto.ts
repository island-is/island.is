import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsObject, IsOptional } from 'class-validator'

import { ChargeCardResponse, VerifyCardResponse } from '../../card/dtos'

export class GooglePayChargeResponse {
  @ApiProperty({
    description:
      'paid when the card was charged; verification_required when a card saved in the Google account must pass 3-D Secure first, then go to charge-verified with the same token',
    enum: ['paid', 'verification_required'],
  })
  @IsIn(['paid', 'verification_required'])
  status!: 'paid' | 'verification_required'

  @ApiPropertyOptional({
    description: 'The payment, when status is paid',
    type: ChargeCardResponse,
  })
  @IsObject()
  @IsOptional()
  payment?: ChargeCardResponse

  @ApiPropertyOptional({
    description:
      'The 3-D Secure verification, when status is verification_required',
    type: VerifyCardResponse,
  })
  @IsObject()
  @IsOptional()
  verification?: VerifyCardResponse
}
