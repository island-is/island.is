import { PaymentFlowChargeAttributes } from '../app/paymentFlow/models/paymentFlow.model'

export type ChargeItem = Pick<
  PaymentFlowChargeAttributes,
  'chargeItemCode' | 'quantity' | 'price' | 'chargeType'
>

export const processCharges = (charges: ChargeItem[]): ChargeItem[] => {
  if (!charges || charges.length === 0) {
    return []
  }

  const chargeMap = new Map<string, ChargeItem>()

  for (const charge of charges) {
    // Use a composite key of chargeItemCode and price.
    // If price is undefined, use "default" string to differentiate from a price of 0.
    const priceKey = charge.price === undefined ? 'default' : charge.price
    const key = `${charge.chargeItemCode}-${priceKey}`

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
