import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsCardVerificationResponse')
export class CardVerificationResponse {
  @Field(() => String, {
    description: 'Id of the payment flow that was verified',
  })
  paymentFlowId!: string
}
