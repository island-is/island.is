import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsCancelBankTransferResponse')
export class CancelBankTransferResponse {
  @Field(() => Boolean)
  ok!: boolean
}
