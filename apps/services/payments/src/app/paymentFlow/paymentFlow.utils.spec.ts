import {
  CatalogItemWithQuantity,
  FjsPaymentMethod,
  PaymentMethod,
} from '../../types'
import { determinePaymentMethods } from './paymentFlow.utils'

describe('paymentFlow.utils', () => {
  describe('determinePaymentMethods', () => {
    it('should return the payment methods that are common to all charges', () => {
      const charges = [
        { paymentOptions: [FjsPaymentMethod.CARD, FjsPaymentMethod.CLAIM] },
        { paymentOptions: [FjsPaymentMethod.CARD, FjsPaymentMethod.CLAIM] },
        { paymentOptions: [FjsPaymentMethod.CARD] },
      ] as CatalogItemWithQuantity[]

      const paymentMethods = determinePaymentMethods(charges)

      expect(paymentMethods).toEqual([PaymentMethod.CARD])
    })

    it('should return both card and invoice when both are common to all charges', () => {
      const charges = [
        { paymentOptions: [FjsPaymentMethod.CARD, FjsPaymentMethod.CLAIM] },
        { paymentOptions: [FjsPaymentMethod.CARD, FjsPaymentMethod.CLAIM] },
      ] as CatalogItemWithQuantity[]

      const paymentMethods = determinePaymentMethods(charges)

      expect(paymentMethods).toEqual([
        PaymentMethod.CARD,
        PaymentMethod.INVOICE,
      ])
    })

    it('should return card as fallback when no payment methods are common to all charges', () => {
      const charges = [
        { paymentOptions: [FjsPaymentMethod.CARD] },
        { paymentOptions: [FjsPaymentMethod.CLAIM] },
        { paymentOptions: [FjsPaymentMethod.CLAIM, FjsPaymentMethod.CARD] },
      ] as CatalogItemWithQuantity[]

      expect(determinePaymentMethods(charges)).toEqual([PaymentMethod.CARD])
    })

    it('should filter out unsupported payment methods', () => {
      const charges = [
        {
          paymentOptions: [
            FjsPaymentMethod.CARD,
            FjsPaymentMethod.TRANSFER,
            'random-payment-method',
          ],
        },
      ] as CatalogItemWithQuantity[]

      const paymentMethods = determinePaymentMethods(charges)

      expect(paymentMethods).toEqual([PaymentMethod.CARD])
    })

    it('should return card as fallback when charges have no common payment options', () => {
      const charges = [
        { paymentOptions: [FjsPaymentMethod.CARD] },
        { paymentOptions: undefined },
      ] as CatalogItemWithQuantity[]

      const paymentMethods = determinePaymentMethods(charges)

      expect(paymentMethods).toEqual([PaymentMethod.CARD])
    })

    it('should return card as fallback for empty charges', () => {
      expect(determinePaymentMethods([])).toEqual([PaymentMethod.CARD])
    })
  })
})
