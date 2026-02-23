import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsVerifyCardInput')
export class VerifyCardInput {
  @Field((_) => String)
  cardNumber!: string

  @Field((_) => Number)
  expiryMonth!: number

  @Field((_) => Number)
  expiryYear!: number

  @Field((_) => String)
  paymentFlowId!: string
}
