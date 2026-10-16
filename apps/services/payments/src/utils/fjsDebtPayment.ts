import format from 'date-fns/format'

import type { PayInfo } from '@island.is/clients/finance-v3'

import { FjsPaymentMethod, PaymentMethod } from '../types'

/** National id of Fjársýsla ríkisins, the organisation that debt payment flows are made out to. */
// eslint-disable-next-line local-rules/disallow-kennitalas
export const FJS_DEBT_ORGANISATION_ID = '5402697509'

/**
 * Product title of debt flows for API consumers. Not stored on the flow: the pay page shows its
 * own translated title for debt flows.
 */
export const DEBT_PAYMENT_PRODUCT_TITLE = 'Greiðsla skulda'

/** A debt flow is closed once FJS rejected its settlement, the payer has to start a new flow. */
export const isDebtFlowClosed = (paymentFlow: {
  type?: string | null
  debtSettlement?: { status?: string | null } | null
}): boolean =>
  paymentFlow.type === 'debt' &&
  paymentFlow.debtSettlement?.status === 'rejected'

/** Card kind used while building payInfo, each FJS client maps it to its own enum. */
export type FjsPaymentKind = 'debit' | 'credit' | 'transfer'

/**
 * What FJS needs to know about how a payment was made, in neutral terms. Each FJS client maps it
 * to its own payInfo, see `toFjsDebtPayInfo` and the charge payload builders.
 */
export type FjsPayInfo = {
  kind: FjsPaymentKind
  RRN: string
  PAN?: string
  authCode?: string
  cardType?: string
  payableAmount: number
  correlationId?: string
}

// Invoices (CLAIM) are never offered for debts, so CLAIM is not mapped.
const PAYMENT_OPTION_TO_METHODS: Partial<Record<string, PaymentMethod[]>> = {
  // Apple Pay rides on card, it has no option of its own.
  [FjsPaymentMethod.CARD]: [PaymentMethod.CARD],
  [FjsPaymentMethod.BANK_TRANSFER]: [PaymentMethod.BANK_TRANSFER],
}

/**
 * Maps the payment options FJS allows for the debts (from validatePayment, e.g.
 * `['CARD', 'TRANSFER']`) to the payment methods we offer. Ignores case. Unknown options are
 * ignored, and reported through `onUnknownOption`.
 */
export const toDebtPaymentMethods = (
  paymentOptions: string[],
  onUnknownOption?: (option: string) => void,
): Set<PaymentMethod> => {
  const methods = new Set<PaymentMethod>()

  for (const option of paymentOptions) {
    const mapped = PAYMENT_OPTION_TO_METHODS[option.toUpperCase()]
    if (!mapped) {
      onUnknownOption?.(option)
      continue
    }

    mapped.forEach((method) => methods.add(method))
  }

  return methods
}

export const toFjsPaymentMeans = (
  kind: FjsPaymentKind,
): PayInfo['paymentMeans'] => {
  switch (kind) {
    case 'debit':
      return 'DebetCard'
    case 'credit':
      return 'KreditCard'
    case 'transfer':
      return 'Transfer'
  }
}

/** The format FJS expects for `paymentDate`. */
export const formatFjsDebtPaymentDate = (date: Date): string =>
  format(date, 'yyyy-MM-dd')

/** Maps the neutral payInfo to the finance-v3 `payDebt` payInfo. */
export const toFjsDebtPayInfo = ({ kind, ...rest }: FjsPayInfo): PayInfo => ({
  ...rest,
  paymentMeans: toFjsPaymentMeans(kind),
})
