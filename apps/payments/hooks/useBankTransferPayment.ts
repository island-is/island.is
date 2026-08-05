import type { ApolloError } from '@apollo/client'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

import { useLocale } from '@island.is/localization'
import {
  BankTransferErrorCode,
  CardErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { findProblemInApolloError } from '@island.is/shared/problem'
import type { Locale } from '@island.is/shared/types'

import { useCreateBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'
import { isHttpsUrl } from '../utils'

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

  const processBankTransferPayment = useCallback(
    async (bankAccountNumber: string) => {
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
              bankAccountNumber,
            },
          },
        })

        const created = response.data?.paymentsCreateBankTransfer
        const scaRedirectUrl = created?.scaRedirectUrl

        // Redirect if onboarding is required.
        if (created?.onboardingRequired && scaRedirectUrl) {
          if (!isHttpsUrl(scaRedirectUrl)) {
            onPaymentError({
              code: BankTransferErrorCode.FailedToCreateBankTransfer,
            })
            return
          }
          window.location.assign(scaRedirectUrl)
          return
        }

        // Reload to land on the dedicated pending screen.
        router.reload()
      } catch (e: unknown) {
        const detail = findProblemInApolloError(e as ApolloError)?.detail

        // The flow already settled (e.g. a callback/redirect race finalized it) — reload to land on
        // the receipt instead of surfacing a generic error and looping back to payment selection.
        if (detail === PaymentServiceCode.PaymentFlowAlreadyPaid) {
          router.reload()
          return
        }

        onPaymentError({
          code:
            (detail as BankTransferErrorCode) ??
            BankTransferErrorCode.FailedToCreateBankTransfer,
        })
      }
    },
    [paymentFlowId, lang, createBankTransferMutation, onPaymentError, router],
  )

  return {
    processBankTransferPayment,
    isBankTransferPaymentProcessing: createBankTransferLoading,
  }
}
