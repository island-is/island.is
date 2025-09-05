import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebLandspitaliPaymentConfirmationEmailResponse')
export class PaymentConfirmationEmailResponse {
  @Field(() => Boolean)
  success!: boolean
}
