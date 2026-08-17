import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

@InputType('HealthDirectorateCreateCertificatePaymentIntentInput')
export class CreateCertificatePaymentIntentInput {
  @Field(() => ID, {
    description: 'ID of the certificate to open a payment for.',
  })
  @IsString()
  @IsNotEmpty()
  id!: string

  @Field({
    description: 'Where to redirect the user after a successful charge.',
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
}
