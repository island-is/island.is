import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class HealthDirectorateCreateCertificatePaymentIntentInput {
  @Field({ description: 'Id of the certificate to open a payment for.' })
  @IsString()
  @IsNotEmpty()
  id!: string

  @Field({
    description:
      "FE-owned URL the gateway redirects the patient's browser to after a successful charge.",
  })
  @IsString()
  @IsNotEmpty()
  returnUrl!: string
}
