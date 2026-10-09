import { Field, InputType } from '@nestjs/graphql'

import type { Locale } from '@island.is/shared/types'

@InputType('PaymentsCreateBankTransferInput')
export class CreateBankTransferInput {
  @Field(() => String)
  paymentFlowId!: string

  @Field(() => String)
  locale!: Locale

  @Field(() => String)
  bankAccountNumber!: string

  @Field(() => String, {
    nullable: true,
    description:
      'National id of the individual with the rights to authorise payments from the company account. Required when the payer is a company.',
  })
  actorNationalId?: string
}
