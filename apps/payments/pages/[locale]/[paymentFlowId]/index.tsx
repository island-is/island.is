import type { ApolloError } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'

import { PaymentsGetFlowPaymentStatus } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  LinkV2,
  toast,
} from '@island.is/island-ui/core'
import { Features } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  BankTransferErrorCode,
  CardErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { PageCard } from '../../../components/PageCard/PageCard'
import initApollo from '../../../graphql/client'
import { PaymentHeader } from '../../../components/PaymentHeader/PaymentHeader'
import {
  PaymentMethod,
  PaymentSelector,
} from '../../../components/PaymentSelector/PaymentSelector'
import { CardPayment } from '../../../components/CardPayment/CardPayment'
import { InvoicePayment } from '../../../components/InvoicePayment/InvoicePayment'
import { BankTransferPayment } from '../../../components/BankTransferPayment/BankTransferPayment'
import { ALLOWED_LOCALES, Locale, isHttpsUrl } from '../../../utils'
import { getConfigcatClient } from '../../../clients/configcat'
import {
  bankTransfer,
  card,
  cardSuccess,
  generic,
  invoice,
  invoiceSuccess,
} from '../../../messages'
import {
  getErrorTitleAndMessage,
  PaymentError,
} from '../../../utils/error/error'

import {
  GetPaymentFlowQuery,
  GetOrganizationByNationalIdQuery,
  GetPaymentFlowQueryVariables,
  GetPaymentFlowDocument,
  GetOrganizationByNationalIdDocument,
  GetOrganizationByNationalIdQueryVariables,
} from '../../../graphql/queries.graphql.generated'
import { PaymentReceipt } from '../../../components/PaymentReceipt'
import { ThreeDSecure } from '../../../components/ThreeDSecure/ThreeDSecure'
import { InvoiceReceipt } from '../../../components/InvoiceReceipt'
import { usePaymentOrchestration } from '../../../hooks/usePaymentOrchestration'
import { useBankTransferStatusPolling } from '../../../hooks/useBankTransferStatusPolling'
import { useCancelBankTransfer } from '../../../hooks/useCancelBankTransfer'
import { withLocale } from '../../../i18n/withLocale'

interface PaymentPageProps {
  locale: string
  paymentFlowId: string
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow']
  paymentFlowErrorCode: PaymentError | null
  organization: GetOrganizationByNationalIdQuery['getOrganizationByNationalId']
  productInformation: {
    amount: number
    title: string
  }
  isInvoicePaymentEnabledForUser: boolean
  isApplePayPaymentEnabledForUser: boolean
  isBankTransferPaymentEnabledForUser: boolean
}

export const getServerSideProps: GetServerSideProps<PaymentPageProps> = async (
  context,
) => {
  const { locale, paymentFlowId } = context.params as {
    locale: string
    paymentFlowId: string
  }

  if (!ALLOWED_LOCALES.includes(locale as Locale)) {
    return {
      redirect: {
        destination: `/${ALLOWED_LOCALES[0]}/${paymentFlowId}`,
        permanent: false,
      },
    }
  }

  const configCatClient = getConfigcatClient()
  const isFeatureEnabled = await configCatClient.getValueAsync(
    Features.isIslandisPaymentEnabled,
    false,
  )

  if (!isFeatureEnabled) {
    return {
      notFound: true,
    }
  }

  const client = initApollo()

  let paymentFlow: PaymentPageProps['paymentFlow'] = null
  let paymentFlowErrorCode: PaymentPageProps['paymentFlowErrorCode'] = null
  let organization: PaymentPageProps['organization'] = null
  let isInvoicePaymentEnabledForUser = false
  let isApplePayPaymentEnabledForUser = false
  let isBankTransferPaymentEnabledForUser = false

  try {
    const { data } = await client.query<
      GetPaymentFlowQuery,
      GetPaymentFlowQueryVariables
    >({
      query: GetPaymentFlowDocument,
      variables: {
        input: {
          id: paymentFlowId,
        },
      },
    })

    paymentFlow = data.paymentsGetFlow

    if (!paymentFlow) {
      throw new Error('Payment flow not found')
    }

    const sanitizedNationalId = paymentFlow.organisationId.replace('-', '')

    // First attempt query with the nationalId as is
    let result = await client.query<
      GetOrganizationByNationalIdQuery,
      GetOrganizationByNationalIdQueryVariables
    >({
      query: GetOrganizationByNationalIdDocument,
      variables: { input: { nationalId: sanitizedNationalId } },
    })

    // If the first query fails, try again with the dashed format XXXXXX-XXXX
    // TODO #1 refactor querying to be reusable
    // TODO #2 normalise and add validation to the the kennitala field in contentful
    if (!result.data?.getOrganizationByNationalId) {
      result = await client.query<
        GetOrganizationByNationalIdQuery,
        GetOrganizationByNationalIdQueryVariables
      >({
        query: GetOrganizationByNationalIdDocument,
        variables: {
          input: {
            nationalId: `${sanitizedNationalId.slice(
              0,
              6,
            )}-${sanitizedNationalId.slice(6)}`,
          },
        },
      })
    }

    organization = result.data?.getOrganizationByNationalId
  } catch (e) {
    const problem = findProblemInApolloError(e)

    if (problem) {
      const code = problem?.detail as CardErrorCode

      paymentFlowErrorCode = {
        code,
      }
    }
  }

  if (paymentFlow) {
    const userObj = {
      identifier: paymentFlow.payerNationalId,
      custom: {
        nationalId: paymentFlow.payerNationalId,
      },
    }

    try {
      isInvoicePaymentEnabledForUser = await configCatClient.getValueAsync(
        Features.isIslandisInvoicePaymentAllowedForUser,
        false,
        userObj,
      )
    } catch (e) {
      console.error('Error getting invoice payment enabled for user', e)
    }

    try {
      isApplePayPaymentEnabledForUser = await configCatClient.getValueAsync(
        Features.isIslandisApplePayPaymentAllowedForUser,
        false,
        userObj,
      )
    } catch (e) {
      console.error('Error getting Apple Pay payment enabled for user', e)
    }

    try {
      isBankTransferPaymentEnabledForUser = await configCatClient.getValueAsync(
        Features.isIslandisBankTransferPaymentAllowedForUser,
        false,
        userObj,
      )
    } catch (e) {
      console.error('Error getting bank transfer payment enabled for user', e)
    }
  }

  const productInformation = {
    amount: paymentFlow?.productPrice ?? 0,
    title: paymentFlow?.productTitle ?? '',
  }

  return {
    props: {
      locale,
      paymentFlowId,
      paymentFlow,
      paymentFlowErrorCode,
      organization,
      productInformation,
      isInvoicePaymentEnabledForUser,
      isApplePayPaymentEnabledForUser,
      isBankTransferPaymentEnabledForUser,
    },
  }
}

function PaymentPage({
  paymentFlow,
  organization,
  productInformation,
  isInvoicePaymentEnabledForUser,
  isApplePayPaymentEnabledForUser,
  isBankTransferPaymentEnabledForUser,
}: PaymentPageProps) {
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      card: '',
      cardExpiry: '',
      cardCVC: '',
      bankAccountNumber: '',
    },
  })
  const { formatMessage } = useLocale()
  const {
    selectedPaymentMethod,
    changePaymentMethod,
    overallIsSubmitting,
    paymentError,
    setPaymentError,
    handleFormSubmit,
    isThreeDSecureModalActive,
    threeDSecureDataForModal,
    handleVerificationCancelledByModal,
    supportsApplePay,
    initiateApplePay,
  } = usePaymentOrchestration({
    paymentFlow,
    productInformation,
    isApplePayPaymentEnabledForUser,
  })
  const router = useRouter()

  // Bank-transfer polling runs only on the dedicated waiting screen (reached via SSR after submit).
  useBankTransferStatusPolling({
    paymentFlowId: paymentFlow?.id,
    enabled:
      paymentFlow?.paymentStatus ===
      PaymentsGetFlowPaymentStatus.bank_transfer_pending,
    expiresAt: paymentFlow?.bankTransferExpiresAt ?? undefined,
    // Success needs a reload to land on the receipt screen
    onSuccess: () => router.reload(),
    onFailure: (error) => setPaymentError(error),
  })

  const { cancelBankTransfer, isCancelling } = useCancelBankTransfer({
    paymentFlowId: paymentFlow?.id,
  })

  // PaymentFlowAlreadyPaid = we lost the race to finalizeBankTransferSuccess.
  // The row settled; reload to land on the receipt.
  const isAlreadyPaidError = (e: ApolloError | undefined) =>
    findProblemInApolloError(e)?.detail ===
    PaymentServiceCode.PaymentFlowAlreadyPaid

  const handleCancelBankTransfer = async () => {
    try {
      await cancelBankTransfer()
      router.reload()
    } catch (e) {
      if (isAlreadyPaidError(e)) {
        router.reload()
        return
      }
      toast.error(formatMessage(bankTransfer.cancelFailedToast))
    }
  }

  const [isStartingAgain, setIsStartingAgain] = useState(false)

  const onErrorBack = async () => {
    const code = paymentError?.code
    const isBankTransferCode =
      code === BankTransferErrorCode.BankTransferRejected ||
      code === BankTransferErrorCode.BankTransferCancelled ||
      code === BankTransferErrorCode.BankTransferGenericError ||
      code === BankTransferErrorCode.BankTransferExpired

    if (!isBankTransferCode) {
      setPaymentError(null)
      return
    }

    // for bank transfer errors, we need to cancel the bank transfer and reload
    setIsStartingAgain(true)
    try {
      await cancelBankTransfer()
      router.reload()
    } catch (e) {
      if (isAlreadyPaidError(e)) {
        router.reload()
        return
      }
      setIsStartingAgain(false)
      toast.error(formatMessage(bankTransfer.cancelFailedToast))
    }
  }

  const availablePaymentMethods = useMemo(() => {
    const methods = [...(paymentFlow?.availablePaymentMethods ?? [])]

    if (isInvoicePaymentEnabledForUser) {
      methods.push('invoice')
    }

    // TEMPORARY (testing): force-surface bank transfer via the rollout flag.
    // Once testing is done this flag is removed and the backend controls
    // availability via availablePaymentMethods.
    if (isBankTransferPaymentEnabledForUser) {
      methods.push('bank_transfer')
    }

    return Array.from(new Set(methods)) as PaymentMethod[]
  }, [
    paymentFlow?.availablePaymentMethods,
    isInvoicePaymentEnabledForUser,
    isBankTransferPaymentEnabledForUser,
  ])

  // Card and bank transfer have input fields that must be valid before submitting; invoice has none.
  const isCardPaymentInvalid =
    selectedPaymentMethod === 'card' && !methods.formState.isValid

  const isBankTransferPaymentInvalid =
    selectedPaymentMethod === 'bank_transfer' && !methods.formState.isValid

  const invalidFlowSetup =
    !organization ||
    !productInformation ||
    !paymentFlow ||
    !paymentFlow.availablePaymentMethods

  const hasPaymentError = paymentError !== null
  const canRenderMainFlow = !invalidFlowSetup && !hasPaymentError

  const { errorTitle, errorMessage } = getErrorTitleAndMessage(
    invalidFlowSetup,
    paymentError,
  )

  const paymentStatus = paymentFlow?.paymentStatus
  const bankTransferScaRedirectUrl = isHttpsUrl(
    paymentFlow?.bankTransferScaRedirectUrl,
  )
    ? paymentFlow?.bankTransferScaRedirectUrl ?? undefined
    : undefined

  const isPaid = paymentStatus === PaymentsGetFlowPaymentStatus.paid
  const isInvoicePending =
    paymentStatus === PaymentsGetFlowPaymentStatus.invoice_pending
  const isBankTransferPending =
    paymentStatus === PaymentsGetFlowPaymentStatus.bank_transfer_pending

  if (canRenderMainFlow && isBankTransferPending) {
    // Pending screen: polling reloads on terminal SUCCESS; the Cancel button cancels + reloads.
    return (
      <PageCard
        headerSlot={
          <PaymentHeader
            title={organization?.title}
            imageSrc={organization?.logo?.url}
            imageAlt={organization?.logo?.title}
            amount={productInformation.amount}
            subTitle={productInformation.title}
            type="primary"
          />
        }
        bodySlot={
          <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
            <AlertMessage
              type="warning"
              message={formatMessage(
                bankTransferScaRedirectUrl
                  ? bankTransfer.waiting
                  : bankTransfer.finishInBankApp,
              )}
            />
            {bankTransferScaRedirectUrl && (
              <Button
                fluid
                unfocusable
                onClick={() =>
                  window.location.assign(bankTransferScaRedirectUrl)
                }
              >
                {formatMessage(bankTransfer.continuePayment)}
              </Button>
            )}
            <Box display="flex" justifyContent="center">
              <Button
                unfocusable
                variant="text"
                loading={isCancelling}
                onClick={handleCancelBankTransfer}
              >
                {formatMessage(generic.buttonCancel)}
              </Button>
            </Box>
          </Box>
        }
      />
    )
  }

  if (canRenderMainFlow && (isPaid || isInvoicePending)) {
    const title = isPaid ? cardSuccess.title : invoiceSuccess.title
    const subTitle = isPaid ? cardSuccess.subTitle : invoiceSuccess.subTitle

    const ReceiptComponent = isPaid ? PaymentReceipt : InvoiceReceipt

    return (
      <>
        <PageCard
          headerSlot={
            <PaymentHeader
              title={formatMessage(title)}
              subTitle={formatMessage(subTitle)}
              type="success"
            />
          }
          bodySlot={
            <>
              <ReceiptComponent
                productTitle={productInformation.title}
                amount={productInformation.amount}
                paidAt={paymentFlow.updatedAt}
                payerNationalId={paymentFlow.payerNationalId}
                payerName={paymentFlow.payerName}
              />

              <Box marginTop={4} width="full">
                <LinkV2
                  href={
                    isInvoicePending
                      ? paymentFlow.invoiceReturnUrl ??
                        paymentFlow.returnUrl ??
                        'https://island.is'
                      : paymentFlow.returnUrl ?? 'https://island.is'
                  }
                >
                  <Button fluid unfocusable>
                    {formatMessage(generic.buttonFinishAndReturn)}
                  </Button>
                </LinkV2>
              </Box>
            </>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageCard
        headerSlot={
          canRenderMainFlow ? (
            <PaymentHeader
              title={organization?.title}
              imageSrc={organization?.logo?.url}
              imageAlt={organization?.logo?.title}
              amount={productInformation.amount}
              subTitle={productInformation.title}
              type="primary"
            />
          ) : (
            <PaymentHeader title={formatMessage(errorTitle)} type="warning" />
          )
        }
        bodySlot={
          canRenderMainFlow ? (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
                  <PaymentSelector
                    availablePaymentMethods={
                      availablePaymentMethods as PaymentMethod[]
                    }
                    selectedPayment={selectedPaymentMethod as any}
                    onSelectPayment={changePaymentMethod}
                  />
                  {selectedPaymentMethod === 'card' && (
                    <CardPayment
                      supportsApplePay={supportsApplePay}
                      initiateApplePay={initiateApplePay}
                    />
                  )}
                  {selectedPaymentMethod === 'invoice' && (
                    <InvoicePayment
                      nationalId={paymentFlow?.payerNationalId}
                      reference={paymentFlow?.payerName}
                    />
                  )}
                  {selectedPaymentMethod === 'bank_transfer' && (
                    <BankTransferPayment />
                  )}
                  <Button
                    type="submit"
                    loading={overallIsSubmitting}
                    fluid
                    disabled={
                      overallIsSubmitting ||
                      isCardPaymentInvalid ||
                      isBankTransferPaymentInvalid
                    }
                  >
                    {selectedPaymentMethod === 'card'
                      ? formatMessage(card.pay)
                      : selectedPaymentMethod === 'bank_transfer'
                      ? formatMessage(bankTransfer.confirm)
                      : formatMessage(invoice.create)}
                  </Button>
                  <Box display="flex" justifyContent="center">
                    <LinkV2
                      href={
                        paymentFlow.cancelUrl ??
                        paymentFlow.returnUrl ??
                        'https://island.is'
                      }
                    >
                      <Button unfocusable variant="text">
                        {formatMessage(generic.buttonCancel)}
                      </Button>
                    </LinkV2>
                  </Box>
                </Box>
              </form>
            </FormProvider>
          ) : (
            <Box display="flex" flexDirection="column" rowGap={3}>
              <Box display="flex" flexDirection="column" textAlign="center">
                <p>{formatMessage(errorMessage)}</p>
              </Box>
              {!invalidFlowSetup && (
                <Button
                  variant="ghost"
                  fluid
                  loading={isStartingAgain}
                  disabled={isStartingAgain}
                  onClick={onErrorBack}
                >
                  {formatMessage(generic.back)}
                </Button>
              )}
            </Box>
          )
        }
      />

      <ThreeDSecure
        isActive={isThreeDSecureModalActive}
        onClose={() => {
          handleVerificationCancelledByModal()
        }}
        hasData={!!threeDSecureDataForModal}
        postUrl={threeDSecureDataForModal?.postUrl}
        scriptPath={threeDSecureDataForModal?.scriptPath}
        verificationFields={threeDSecureDataForModal?.verificationFields ?? []}
      />
    </>
  )
}

export default withLocale(PaymentPage)
