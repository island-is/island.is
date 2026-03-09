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
  const paymentMethods = charges.map((charge) => charge.paymentOptions)

  const commonPaymentMethods = paymentMethods.reduce((acc, paymentOptions) => {
    return acc?.filter((option) => paymentOptions?.includes(option)) ?? []
  }, paymentMethods[0])

  return (commonPaymentMethods ?? [])
    .map((method) => mapFjsPaymentMethodTo[method as FjsPaymentMethod])
    .filter(Boolean) as PaymentMethod[]
}
