import { PaymentFlowChargeAttributes } from '../app/paymentFlow/models/paymentFlow.model'

export type ChargeItem = Pick<
  PaymentFlowChargeAttributes,
  'chargeItemCode' | 'quantity' | 'price' | 'chargeType' | 'reference'
>

/**
 * Merges charges that share the same chargeItemCode, price and reference by summing their quantities.
 * Returns one charge per unique (chargeItemCode, price, reference) triple.
 */
export const processCharges = (charges: ChargeItem[]): ChargeItem[] => {
  if (!charges || charges.length === 0) {
    return []
  }

  const chargeMap = new Map<string, ChargeItem>()

  for (const charge of charges) {
    // Use a composite key of chargeItemCode, price and reference
    // use default string for undefined values
    const priceKey = charge.price === undefined ? 'default' : charge.price
    const referenceKey =
      charge.reference === undefined ? 'default' : charge.reference
    const key = `${charge.chargeItemCode}-${priceKey}-${referenceKey}`

    if (chargeMap.has(key)) {
      const existingCharge = chargeMap.get(key) as ChargeItem

      chargeMap.set(key, {
        ...existingCharge,
        quantity: existingCharge.quantity + charge.quantity,
      })
    } else {
      chargeMap.set(key, { ...charge })
    }
  }

  return Array.from(chargeMap.values())
}
