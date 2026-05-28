import { useCallback } from 'react'

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

      const scaRedirectUrl =
        response.data?.paymentsCreateBankTransfer.scaRedirectUrl

      if (scaRedirectUrl) {
        // The bank requires an interactive SCA — send the user there. Once they finish, the bank
        // returns them to the partnerRedirectUrl (the existing flow page) and TODO 14's polling
        // resolves the terminal status.
        window.location.assign(scaRedirectUrl)
        return
      }
      // Empty scaRedirectUrl ⇒ back-channel SCA (push notification in the bank app). Stay on the
      // page; the polling loop picks up the eventual terminal status.
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
  }
}
