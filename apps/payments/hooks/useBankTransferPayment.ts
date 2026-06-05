import { useCallback } from 'react'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const [createBankTransferMutation, { loading: createBankTransferLoading }] =
    useCreateBankTransferMutation()

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

      // Interactive SCA → redirect.
      if (scaRedirectUrl) {
        window.location.assign(scaRedirectUrl)
        return
      }

      // No SCA redirect URL → reload so SSR lands on the dedicated waiting screen.
      router.reload()
    } catch (e: unknown) {
      onPaymentError({
        code: (e instanceof Error
          ? e.message
          : CardErrorCode.UnknownCardError) as CardErrorCode,
      })
    }
  }, [paymentFlowId, lang, createBankTransferMutation, onPaymentError, router])

  return {
    processBankTransferPayment,
    isBankTransferPaymentProcessing: createBankTransferLoading,
  }
}
