import { useCallback } from 'react'
import { useRouter } from 'next/router'

import { useLocale } from '@island.is/localization'
import { CardErrorCode } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

import { useCreateBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

interface UseBankTransferPaymentProps {
  paymentFlowId: string | undefined
  onPaymentError: (error: PaymentError) => void
}

const toLocale = (lang?: string): Locale => (lang === 'en' ? 'en' : 'is')

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
            locale: toLocale(lang),
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
