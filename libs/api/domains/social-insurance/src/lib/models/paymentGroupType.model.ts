import { registerEnumType } from '@nestjs/graphql'

export enum PaymentGroupType {
  SUBTRACTION = 'subtraction',
  PAYMENTS = 'payments',
  PAYED = 'payed',
  DEBT = 'debt',
  UNKNOWN = 'unknown',
}

registerEnumType(PaymentGroupType, { name: 'SocialInsurancePaymentGroupType' })

export const mapToPaymentGroupType = (groupId?: number) => {
  if (!groupId) {
    return PaymentGroupType.UNKNOWN
  }
  switch (groupId) {
    case 20:
      return PaymentGroupType.SUBTRACTION
    case 30:
      return PaymentGroupType.PAYED
    default:
      return PaymentGroupType.PAYMENTS
  }
}
