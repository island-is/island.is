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
      "Where to redirect the user's browser after a successful charge. Host allow-listing is enforced upstream by the Directorate of Health API (PAYMENT_RETURN_URL_ALLOWED_HOSTS), which rejects other hosts with a 400 — this layer only validates URL shape.",
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
      "Where to redirect the user's browser if they abandon the payment or the gateway session times out. Defaults to returnUrl when omitted. Host allow-listing is enforced upstream by the Directorate of Health API, same as returnUrl.",
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
