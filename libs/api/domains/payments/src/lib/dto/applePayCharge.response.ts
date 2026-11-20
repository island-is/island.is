import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsApplePayChargeResponse')
export class ApplePayChargeResponse {
  @Field(() => Boolean, { description: 'Was the payment successful?' })
  isSuccess!: boolean

  @Field(() => String, {
    description: 'The response code from the payment provider',
  })
  responseCode!: string
}
