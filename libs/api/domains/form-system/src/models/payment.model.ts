import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentStatusResponse')
export class PaymentStatusResponse {
  @Field(() => Boolean)
  fulfilled!: boolean

  @Field(() => String)
  paymentUrl!: string
}
