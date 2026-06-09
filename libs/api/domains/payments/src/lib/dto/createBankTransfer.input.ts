import { Field, InputType } from '@nestjs/graphql'

import { Locale } from '@island.is/shared/types'

@InputType('PaymentsCreateBankTransferInput')
export class CreateBankTransferInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => String)
  locale!: Locale
}
