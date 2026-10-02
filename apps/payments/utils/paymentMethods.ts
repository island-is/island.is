import type { PaymentMethod } from '../components/PaymentSelector/PaymentSelector'

interface AvailablePaymentMethodsInput {
  // What the payments service offers for the flow.
  flowMethods: readonly string[]
  isInvoicePaymentEnabledForUser: boolean
  isBankTransferPaymentEnabledForUser: boolean
  isCompanyPayer: boolean
}

/** The methods the payment selector offers: the flow's own, plus any the rollout flags add. */
export const getAvailablePaymentMethods = ({
  flowMethods,
  isInvoicePaymentEnabledForUser,
  isBankTransferPaymentEnabledForUser,
  isCompanyPayer,
}: AvailablePaymentMethodsInput): PaymentMethod[] => {
  const methods = [...flowMethods]

  if (isInvoicePaymentEnabledForUser) {
    methods.push('invoice')
  }

  // TEMPORARY (testing): force-surface bank transfer via the rollout flag.
  // Once testing is done this flag is removed and the backend controls
  // availability via availablePaymentMethods. Never for a company: company bank
  // transfers are controlled by the per-company flag in the payments service,
  // which would refuse the transfer anyway.
  if (isBankTransferPaymentEnabledForUser && !isCompanyPayer) {
    methods.push('bank_transfer')
  }

  return Array.from(new Set(methods)) as PaymentMethod[]
}
