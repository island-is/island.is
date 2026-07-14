import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateBankTransferResponse {
  @IsString()
  @ApiProperty()
  readonly providerPaymentId!: string

  // Empty / undefined = back-channel SCA, no redirect.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly scaRedirectUrl?: string

  @IsDate()
  @ApiProperty()
  readonly expiresAt!: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description:
      'True when the payer must complete onboarding before SCA can proceed. ' +
      'The frontend should redirect to scaRedirectUrl in this case only.',
  })
  readonly onboardingRequired?: boolean
}
