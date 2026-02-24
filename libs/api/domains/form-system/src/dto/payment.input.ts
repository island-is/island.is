import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@InputType('PaymentStatusFormSystemInput')
export class PaymentStatusInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String, { nullable: true })
  locale?: string
}

@InputType('PaymentFlowMetadataFormSystemInput')
export class PaymentFlowMetadataInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  paymentId!: string
}

@InputType('CallbackFormSystemInput')
export class CallbackInput {
  @Field(() => String)
  type!: string

  @Field(() => String)
  paymentFlowId!: string
}

@InputType('PaymentFormSystemInput')
export class PaymentInput {
  @Field(() => String)
  cardVR!: string

  @Field(() => String)
  acquirerReferenceNumber!: string

  @Field(() => String)
  transactionID!: string

  @Field(() => String)
  authorizationCode!: string

  @Field(() => String)
  transactionLifecycleId!: string

  @Field(() => String)
  maskedCardNumber!: string

  @Field(() => Boolean)
  isSuccess!: boolean

  @Field(() => GraphQLJSON)
  cardInformation!: Record<string, unknown>

  @Field(() => String)
  transactionType!: string

  @Field(() => Boolean)
  isCardPresent!: boolean

  @Field(() => String)
  currency!: string

  @Field(() => String)
  authenticationMethod!: string

  @Field(() => Number)
  authorizedAmount!: number

  @Field(() => GraphQLJSON)
  marketInformation!: Record<string, unknown>

  @Field(() => String)
  authorizationIdentifier!: string

  @Field(() => String)
  eci!: string

  @Field(() => String)
  paymentAccountReference!: string

  @Field(() => String)
  authorizationExpiryDate!: string

  @Field(() => String)
  responseCode!: string

  @Field(() => String)
  responseDescription!: string

  @Field(() => String)
  responseTime!: string

  @Field(() => String)
  correlationID!: string
}

@InputType('ChargeFormSystemInput')
export class ChargeInput {
  @Field(() => String)
  created!: string

  @Field(() => String)
  modified!: string

  @Field(() => String)
  id!: string

  @Field(() => String)
  paymentFlowId!: string

  @Field(() => String)
  receptionId!: string

  @Field(() => String)
  user4!: string
}

@InputType('EventMetadataFormSystemInput')
export class EventMetadataInput {
  @Field(() => PaymentInput)
  payment!: PaymentInput

  @Field(() => ChargeInput)
  charge!: ChargeInput
}

@InputType('PaymentDetailsFormSystemInput')
export class PaymentDetailsInput {
  @Field(() => String)
  paymentMethod!: string

  @Field(() => String)
  reason!: string

  @Field(() => String)
  message!: string

  @Field(() => EventMetadataInput)
  eventMetadata!: EventMetadataInput
}

@InputType('ApiClientCallbackFormSystemInput')
export class ApiClientCallbackInput {
  @Field(() => String)
  type!: string

  @Field(() => String)
  paymentFlowId!: string

  @Field(() => PaymentFlowMetadataInput)
  paymentFlowMetadata!: PaymentFlowMetadataInput

  @Field(() => String)
  occurredAt!: string

  @Field(() => PaymentDetailsInput)
  details!: PaymentDetailsInput
}

@InputType('PaymentCallbackFormSystemInput')
export class PaymentCallbackInput {
  @Field(() => ApiClientCallbackInput)
  apiClientCallback!: ApiClientCallbackInput
}

export enum CallbackStatusEnum {
  paid = 'paid',
  cancelled = 'cancelled',
  recreated = 'recreated',
  recreatedAndPaid = 'recreatedAndPaid',
}

registerEnumType(CallbackStatusEnum, {
  name: 'CallbackStatusEnum',
})

@InputType('PaymentApprovedCallbackFormSystemInput')
export class PaymentApprovedCallbackInput {
  @Field(() => String)
  receptionID!: string

  @Field(() => String)
  chargeItemSubject!: string

  @Field(() => CallbackStatusEnum)
  status!: CallbackStatusEnum
}

@InputType('PaymentApprovedFormSystemInput')
export class PaymentApprovedInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  id!: string

  @Field(() => PaymentApprovedCallbackInput)
  callback!: PaymentApprovedCallbackInput
}
