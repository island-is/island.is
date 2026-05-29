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
  const [
    createBankTransferMutation,
    { loading: createBankTransferLoading },
  ] = useCreateBankTransferMutation()
  // Timestamp of the most-recent successful `paymentsCreateBankTransfer`. The page reads this and
  // feeds it as the polling hook's `trigger` so the back-channel-SCA case (empty `scaRedirectUrl`,
  // user stays on the page) restarts polling after the row is persisted.
  const [lastAttemptAt, setLastAttemptAt] = useState<number>(0)

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
      // Mark the attempt as started regardless of redirect; the page's polling hook restarts on
      // this signal so back-channel SCA works without a separate "kick polling" call.
      setLastAttemptAt(Date.now())

      const scaRedirectUrl =
        response.data?.paymentsCreateBankTransfer.scaRedirectUrl

      if (scaRedirectUrl) {
        // The bank requires an interactive SCA — send the user there. After they finish, Blikk
        // returns them to the partnerRedirectUrl (the existing flow page) and the polling loop
        // resolves the terminal status.
        window.location.assign(scaRedirectUrl)
        return
      }
      // Empty scaRedirectUrl ⇒ back-channel SCA (push notification in the bank app). Stay on the
      // page; polling picks up the eventual terminal status.
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
  }
}
