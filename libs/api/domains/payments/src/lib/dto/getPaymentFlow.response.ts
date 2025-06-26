import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { GraphQLJSON } from 'graphql-type-json'

import { GetPaymentFlowDTOPaymentStatusEnum } from '@island.is/clients/payments'

registerEnumType(GetPaymentFlowDTOPaymentStatusEnum, {
  name: 'PaymentsGetFlowPaymentStatus',
})

@ObjectType('PaymentsGetPaymentFlowResponse')
export class GetPaymentFlowResponse {
  @Field(() => ID)
  id!: string

  @Field(() => GetPaymentFlowDTOPaymentStatusEnum)
  paymentStatus!: GetPaymentFlowDTOPaymentStatusEnum

  @Field(() => String)
  productTitle!: string

  @Field(() => Number)
  productPrice!: number

  @Field(() => String, { nullable: true })
  existingInvoiceId?: string

  @Field(() => String)
  payerNationalId!: string

  @Field(() => String)
  payerName!: string

  @Field(() => [String])
  availablePaymentMethods!: string[]

  @Field(() => String)
  organisationId!: string

  @Field(() => GraphQLJSON, {
    nullable: true,
    description:
      'Arbitrary JSON data provided by the consuming service that will be returned on in callbacks (e.g. onSuccess, onUpdate). Example use case: the service that created the payment flow needs to pass some data that will be returned in the callback',
  })
  metadata?: object

  @Field(() => String, { nullable: true })
  returnUrl?: string

  @Field(() => String, { nullable: true })
  cancelUrl?: string

  @Field(() => Boolean, { nullable: true })
  redirectToReturnUrlOnSuccess?: boolean

  @Field(() => Date)
  updatedAt!: Date
}
