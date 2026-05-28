import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { CreateBankTransferInputLocaleEnum } from '@island.is/clients/payments'

registerEnumType(CreateBankTransferInputLocaleEnum, {
  name: 'PaymentsCreateBankTransferLocale',
})

@InputType('PaymentsCreateBankTransferInput')
export class CreateBankTransferInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => CreateBankTransferInputLocaleEnum)
  locale!: CreateBankTransferInputLocaleEnum
}
