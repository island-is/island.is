import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

@InputType()
export class HealthDirectorateCreateCertificatePaymentIntentInput {
  @Field(() => ID, {
    description: 'ID of the certificate to open a payment intent for.',
  })
  @IsString()
  @IsNotEmpty()
  id!: string

  @Field({
    description:
      "Where to redirect the user's browser after a successful charge. Must be an allow-listed island.is host.",
  })
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      require_tld: false,
    },
    { message: 'returnUrl must be a valid https URL including protocol' },
  )
  @IsNotEmpty()
  returnUrl!: string

  @Field({
    nullable: true,
    description:
      "Where to redirect the user's browser if they abandon the payment or the gateway session times out. Defaults to returnUrl when omitted.",
  })
  @IsOptional()
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      require_tld: false,
    },
    { message: 'cancelUrl must be a valid https URL including protocol' },
  )
  cancelUrl?: string
}
