import { Field, InputType } from '@nestjs/graphql'
import { VerifyCardInput } from './verifyCard.input'

@InputType('PaymentsChargeCardInput')
export class ChargeCardInput extends VerifyCardInput {
  @Field((_) => String)
  cvc!: string
}
