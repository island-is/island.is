import { useCallback, useState } from 'react'

import { PaymentsCreateBankTransferLocale } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { CardErrorCode } from '@island.is/shared/constants'

import { useCreateBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

interface UseBankTransferPaymentProps {
  paymentFlowId: string | undefined
  onPaymentError: (error: PaymentError) => void
}

const toLocaleEnum = (lang?: string): PaymentsCreateBankTransferLocale =>
  lang === 'en'
    ? PaymentsCreateBankTransferLocale.en
    : PaymentsCreateBankTransferLocale.is

export const useBankTransferPayment = ({
  paymentFlowId,
  onPaymentError,
}: UseBankTransferPaymentProps) => {
  const { lang } = useLocale()
  const [createBankTransferMutation, { loading: createBankTransferLoading }] =
    useCreateBankTransferMutation()
  // Bump after a successful create — used as the polling hook's `trigger` for back-channel SCA.
  const [lastAttemptAt, setLastAttemptAt] = useState<number>(0)
  // Latest expiry from create — feeds the polling hook's hard timeout.
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined)

  const processBankTransferPayment = useCallback(async () => {
    if (!paymentFlowId) {
      onPaymentError({ code: CardErrorCode.GenericDecline })
      return
    }

    try {
      const response = await createBankTransferMutation({
        variables: {
          input: {
            paymentFlowId,
            locale: toLocaleEnum(lang),
          },
        },
      })
      setLastAttemptAt(Date.now())
      setExpiresAt(response.data?.paymentsCreateBankTransfer.expiresAt)

      const scaRedirectUrl =
        response.data?.paymentsCreateBankTransfer.scaRedirectUrl

      // Interactive SCA → redirect. Empty URL = back-channel SCA, stay on the page.
      if (scaRedirectUrl) {
        window.location.assign(scaRedirectUrl)
        return
      }
    } catch (e: unknown) {
      onPaymentError({
        code: (e instanceof Error
          ? e.message
          : CardErrorCode.UnknownCardError) as CardErrorCode,
      })
    }
  }, [paymentFlowId, lang, createBankTransferMutation, onPaymentError])

  return {
    processBankTransferPayment,
    isBankTransferPaymentProcessing: createBankTransferLoading,
    lastAttemptAt,
    expiresAt,
  }
}
