import { CreatePaymentFlowInput } from '../app/paymentFlow/dtos/createPaymentFlow.input'
import { PaymentFlowEvent } from '../app/paymentFlow/models/paymentFlowEvent.model'

export enum PaymentMethod {
  CARD = 'card',
  INVOICE = 'invoice',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  INVOICE_PENDING = 'invoice_pending',
  PAID = 'paid',
}

export enum PaymentFlowEventType {
  CREATE = 'create',
  UPDATE = 'update',
  SUCCESS = 'success',
  ERROR = 'error',
  DELETED = 'deleted',
}

export enum PaymentFlowEventReason {
  PAYMENT_STARTED = 'payment_started',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  DELETED_ADMIN = 'deleted_admin',
  DELETED_AUTO = 'deleted_auto',
  OTHER = 'other',
}

export type PaymentFlowUpdateEvent = {
  type: PaymentFlowEvent['type']
  paymentFlowId: PaymentFlowEvent['paymentFlowId'] // Unique identifier for the payment flow
  paymentFlowMetadata: CreatePaymentFlowInput['metadata'] // Metadata passed to the payment flow during creation (for example applicationId)
  occurredAt: PaymentFlowEvent['occurredAt'] // ISO timestamp for when the event occurred
  details?: {
    paymentMethod: PaymentMethod
    reason: PaymentFlowEvent['reason']
    message?: PaymentFlowEvent['message'] // [Optional] Human readable message for the event if needed
    eventMetadata?: PaymentFlowEvent['metadata'] // [Optional] JSON string with additional data for the event
  }
}
