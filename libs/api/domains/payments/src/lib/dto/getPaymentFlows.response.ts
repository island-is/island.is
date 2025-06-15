import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'
import {
  GetPaymentFlowDTOPaymentStatusEnum,
  PaymentFlowEventDTOTypeEnum,
  PaymentFlowEventDTOReasonEnum,
  GetPaymentFlowDTO,
} from '@island.is/clients/payments'
import { PaymentFlowEvent } from './paymentFlowEvent.dto'
import { GetPaymentFlowResponse } from './getPaymentFlow.response'

// registerEnumType(PaymentFlowEventDTOTypeEnum, {
//   name: 'PaymentsGetFlowsPaymentFlowEventDTOType',
// })

// registerEnumType(PaymentFlowEventDTOReasonEnum, {
//   name: 'PaymentsGetFlowsPaymentFlowEventDTOReason',
// })

// registerEnumType(GetPaymentFlowDTOPaymentStatusEnum, {
//   name: 'PaymentsGetFlowPaymentStatus',
// })

@ObjectType('PaymentsPageInfo')
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage!: boolean

  @Field(() => Boolean)
  hasPreviousPage!: boolean

  @Field(() => String, { nullable: true })
  startCursor?: string

  @Field(() => String, { nullable: true })
  endCursor?: string
}

// @ObjectType('PaymentsGetPaymentFlowsItem')
// export class GetPaymentFlowsItem {
//   @Field(() => ID)
//   id!: string

//   @Field(() => GetPaymentFlowDTOPaymentStatusEnum)
//   paymentStatus!: GetPaymentFlowDTOPaymentStatusEnum

//   @Field(() => String)
//   productTitle!: string

//   @Field(() => Number)
//   productPrice!: number

//   @Field(() => String, { nullable: true })
//   existingInvoiceId?: string

//   @Field(() => String)
//   payerNationalId!: string

//   @Field(() => String)
//   payerName!: string

//   @Field(() => [String])
//   availablePaymentMethods!: string[]

//   @Field(() => String)
//   organisationId!: string

//   @Field(() => GraphQLJSON, {
//     nullable: true,
//     description:
//       'Arbitrary JSON data provided by the consuming service that will be returned on in callbacks (e.g. onSuccess, onUpdate). Example use case: the service that created the payment flow needs to pass some data that will be returned in the callback',
//   })
//   metadata?: object

//   @Field(() => String, { nullable: true })
//   returnUrl?: string

//   @Field(() => Boolean, { nullable: true })
//   redirectToReturnUrlOnSuccess?: boolean

//   @Field(() => [PaymentFlowEvent], { nullable: true })
//   events?: PaymentFlowEvent[]

//   @Field(() => Date)
//   updatedAt!: Date
// }

@ObjectType('PaymentsGetPaymentFlowsResponse')
export class GetPaymentFlowsResponse {
  @Field(() => [GetPaymentFlowResponse])
  data!: GetPaymentFlowResponse[]

  @Field(() => Number)
  totalCount!: number

  @Field(() => PageInfo)
  pageInfo!: PageInfo
}
