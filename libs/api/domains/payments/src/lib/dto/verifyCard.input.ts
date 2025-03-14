import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsVerifyCardInput')
export class VerifyCardInput {
  @Field((_) => Number)
  cardNumber!: number

  @Field((_) => Number)
  expiryMonth!: number

  @Field((_) => Number)
  expiryYear!: number

  @Field((_) => Number)
  amount!: number

  @Field((_) => String)
  paymentFlowId!: string
}
