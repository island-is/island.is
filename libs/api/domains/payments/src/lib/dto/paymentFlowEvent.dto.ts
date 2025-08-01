import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'
import {
  PaymentFlowEventDTOTypeEnum,
  PaymentFlowEventDTOReasonEnum,
} from '@island.is/clients/payments'

registerEnumType(PaymentFlowEventDTOTypeEnum, {
  name: 'PaymentsPaymentFlowEventType',
})

registerEnumType(PaymentFlowEventDTOReasonEnum, {
  name: 'PaymentsPaymentFlowEventReason',
})

@ObjectType('PaymentsPaymentFlowEvent')
export class PaymentFlowEvent {
  @Field(() => ID)
  id!: string

  @Field(() => ID)
  paymentFlowId!: string

  @Field(() => PaymentFlowEventDTOTypeEnum)
  type!: PaymentFlowEventDTOTypeEnum

  @Field(() => PaymentFlowEventDTOReasonEnum)
  reason!: PaymentFlowEventDTOReasonEnum

  @Field(() => String)
  paymentMethod!: string

  @Field(() => Date)
  occurredAt!: Date

  @Field(() => String)
  message!: string

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: object

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date
}
