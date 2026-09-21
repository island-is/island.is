import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateCertificatePaymentIntent {
  @Field(() => ID)
  paymentId!: string

  @Field({ description: 'URL to redirect the patient to in order to pay.' })
  paymentPageUrl!: string
}
