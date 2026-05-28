import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateBankTransferResponse {
  @IsString()
  @ApiProperty()
  readonly providerPaymentId!: string

  /**
   * Where the frontend should redirect the user for Strong Customer Authentication. Empty / undefined
   * means back-channel SCA (the user gets a push from their bank); the frontend stays on the page.
   */
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly scaRedirectUrl?: string
}
