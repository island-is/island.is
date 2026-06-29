import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { VerifyBankTransferResponseStatusEnum } from '@island.is/clients/payments'

registerEnumType(VerifyBankTransferResponseStatusEnum, {
  name: 'PaymentsBankTransferStatus',
})

@ObjectType('PaymentsVerifyBankTransferResponse')
export class VerifyBankTransferResponse {
  @Field(() => VerifyBankTransferResponseStatusEnum)
  status!: VerifyBankTransferResponseStatusEnum

  @Field(() => String, { nullable: true })
  message?: string
}
