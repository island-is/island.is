import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

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
  @IsString()
  @IsNotEmpty()
  returnUrl!: string
}
