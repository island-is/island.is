import {
  CatalogItemWithQuantity,
  PaymentMethod,
  FjsPaymentMethod,
} from '../../types'

const mapFjsPaymentMethodTo: Record<FjsPaymentMethod, PaymentMethod | null> = {
  [FjsPaymentMethod.CARD]: PaymentMethod.CARD,
  [FjsPaymentMethod.CLAIM]: PaymentMethod.INVOICE,
  [FjsPaymentMethod.TRANSFER]: null, // not supported yet
}

/**
 * Finds the payment methods common to all charges and maps them
 * to supported PaymentMethod values. Unsupported FJS methods are filtered out.
 */
export const determinePaymentMethods = (
  charges: CatalogItemWithQuantity[],
): PaymentMethod[] => {
  const paymentMethods = charges
    .map((charge) => charge.paymentOptions)
    .filter((charge) => charge !== undefined)

  const commonPaymentMethods = paymentMethods.reduce((acc, paymentOptions) => {
    return acc?.filter((option) => paymentOptions?.includes(option)) ?? []
  }, paymentMethods[0])

  if (commonPaymentMethods.length === 0) {
    return [PaymentMethod.CARD]
  }

  return commonPaymentMethods
    .map((method) => mapFjsPaymentMethodTo[method as FjsPaymentMethod])
    .filter(Boolean) as PaymentMethod[]
}
