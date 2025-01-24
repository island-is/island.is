import { Field, ObjectType, ID } from '@nestjs/graphql'

import { GraphQLJSON } from 'graphql-type-json'

@ObjectType('PaymentsGetPaymentFlowResponse')
export class GetPaymentFlowResponse {
  @Field(() => ID)
  id!: string

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
}
