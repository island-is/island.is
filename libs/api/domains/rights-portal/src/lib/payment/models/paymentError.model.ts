import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum PaymentErrorStatus {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVICE_ERROR = 'INTERNAL_SERVICE_ERROR',
}

registerEnumType(PaymentErrorStatus, {
  name: 'RightsPortalPaymentErrorStatus',
})

@ObjectType('RightsPortalPaymentError')
export class PaymentError {
  @Field(() => PaymentErrorStatus)
  status!: PaymentErrorStatus
}
