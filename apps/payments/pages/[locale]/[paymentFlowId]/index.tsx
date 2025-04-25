import { useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Box, Button } from '@island.is/island-ui/core'
import { Features } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  PaymentsChargeCardInput,
  PaymentsVerifyCardInput,
} from '@island.is/api/schema'
import { CardErrorCode } from '@island.is/shared/constants'

import { PageCard } from '../../../components/PageCard/PageCard'
import initApollo from '../../../graphql/client'
import { PaymentHeader } from '../../../components/PaymentHeader/PaymentHeader'
import { PaymentSelector } from '../../../components/PaymentSelector/PaymentSelector'
import { CardPayment } from '../../../components/CardPayment/CardPayment'
import { InvoicePayment } from '../../../components/InvoicePayment/InvoicePayment'
import { ALLOWED_LOCALES, Locale } from '../../../utils'
import { getConfigcatClient } from '../../../clients/configcat'
import {
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
  VerifyCardMutation,
  ChargeCardMutation,
  useVerifyCardMutation,
  useChargeCardMutation,
  useCreateInvoiceMutation,
} from '../../../graphql/mutations.graphql.generated'
import {
  GetPaymentFlowQuery,
  GetOrganizationByNationalIdQuery,
  GetPaymentFlowQueryVariables,
  GetPaymentFlowDocument,
  GetOrganizationByNationalIdDocument,
  GetOrganizationByNationalIdQueryVariables,
  useGetVerificationStatusLazyQuery,
} from '../../../graphql/queries.graphql.generated'
import { PaymentReceipt } from '../../../components/PaymentReceipt'
import { ThreeDSecure } from '../../../components/ThreeDSecure/ThreeDSecure'
import { InvoiceReceipt } from '../../../components/InvoiceReceipt'

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
    },
  }
}

export default function PaymentPage({
  paymentFlow,
  organization,
  productInformation,
}: PaymentPageProps) {
  const [verifyCardMutation] = useVerifyCardMutation()
  const [chargeCardMutation] = useChargeCardMutation()
  const [getVerificationStatusQuery] = useGetVerificationStatusLazyQuery()
  const [createInvoiceMutation] = useCreateInvoiceMutation()

  const router = useRouter()
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      card: '',
      cardExpiry: '',
      cardCVC: '',
    },
  })
  const { formatMessage } = useLocale()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentFlow?.availablePaymentMethods?.[0] ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingCard, setIsVerifyingCard] = useState(false)
  const [threeDSecureData, setThreeDSecureData] = useState(null)
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null)

  // To break the verification loop
  const isVerifyingRef = useRef(false)

  const invalidFlowSetup =
    !organization ||
    !productInformation ||
    !paymentFlow ||
    !paymentFlow.availablePaymentMethods

  const waitForCardVerification = async () => {
    const maximumWaitTimeSeconds = 2 * 60
    let remainingWaitTimeInMilliSeconds = maximumWaitTimeSeconds * 1000

    const interval = 5000

    while (remainingWaitTimeInMilliSeconds > 0) {
      if (!isVerifyingRef.current) {
        throw new Error(CardErrorCode.VerificationCancelledByUser)
      }

      const { data } = await getVerificationStatusQuery({
        variables: {
          input: {
            id: paymentFlow.id,
          },
        },
      })

      if (data) {
        const status = data.paymentsGetVerificationStatus

        if (status.isVerified) {
          return true
        }
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
      remainingWaitTimeInMilliSeconds -= interval
    }

    return false
  }

  const verifyCard = async (
    input: PaymentsVerifyCardInput,
  ): Promise<VerifyCardMutation['paymentsVerifyCard']> => {
    try {
      const { data, errors } = await verifyCardMutation({
        variables: {
          input,
        },
      })

      if (errors) {
        // TODO
      }

      if (!data) {
        throw new Error('Failed to verify card')
      }

      const verification = data.paymentsVerifyCard

      if (!verification.isSuccess) {
        setPaymentError({
          code: verification.responseCode as CardErrorCode,
        })
      }

      return verification
    } catch (e) {
      const problem = findProblemInApolloError(e)

      if (problem) {
        throw new Error(problem?.detail)
      }

      throw new Error(CardErrorCode.UnknownCardError)
    }
  }

  const chargeCard = async (
    input: PaymentsChargeCardInput,
  ): Promise<ChargeCardMutation['paymentsChargeCard']> => {
    try {
      const { data, errors } = await chargeCardMutation({
        variables: {
          input,
        },
      })

      if (!data) {
        throw new Error('Failed to charge card')
      }

      const result = data?.paymentsChargeCard

      if (!result.isSuccess) {
        setPaymentError({
          code: result.responseCode as CardErrorCode,
        })
      }

      return result
    } catch (e) {
      const problem = findProblemInApolloError(e)

      if (problem) {
        throw new Error(problem?.detail)
      }

      throw new Error(CardErrorCode.UnknownCardError)
    }
  }

  const payWithCard = async (data: Record<string, string>) => {
    const { card, cardExpiry, cardCVC } = data

    if (!card || !cardExpiry || typeof cardExpiry !== 'string' || !cardCVC) {
      return
    }

    const [month, year] = cardExpiry.split('/')

    const cardInfo = {
      number: card,
      expiryMonth: Number(month),
      expiryYear: Number(year),
      cvc: cardCVC,
    }

    const verifyCardResponse = await verifyCard({
      amount: productInformation.amount,
      cardNumber: cardInfo.number,
      expiryMonth: cardInfo.expiryMonth,
      expiryYear: cardInfo.expiryYear,
      paymentFlowId: paymentFlow.id,
    })

    setVerificationStatus(true)
    setThreeDSecureData(verifyCardResponse)

    const isCardVerified = await waitForCardVerification()

    if (!isCardVerified) {
      throw new Error(CardErrorCode.VerificationDeadlineExceeded)
    }

    const chargeCardResponse = await chargeCard({
      amount: productInformation.amount,
      cardNumber: cardInfo.number,
      cvc: cardInfo.cvc,
      expiryMonth: cardInfo.expiryMonth,
      expiryYear: cardInfo.expiryYear,
      paymentFlowId: paymentFlow.id,
    })

    if (!chargeCardResponse.isSuccess) {
      throw new Error(chargeCardResponse.responseCode)
    }

    if (paymentFlow.redirectToReturnUrlOnSuccess && paymentFlow.returnUrl) {
      window.location.assign(paymentFlow.returnUrl)
    } else {
      router.reload()
    }
  }

  const onSubmit: SubmitHandler<Record<string, string>> = async (data) => {
    setIsSubmitting(true)

    try {
      if (selectedPaymentMethod === 'card') {
        await payWithCard(data)
        return // No need to set isSubmitting to false
      } else {
        const response = await createInvoiceMutation({
          variables: {
            input: {
              paymentFlowId: paymentFlow.id,
            },
          },
        })

        if (!response.data?.paymentsCreateInvoice.isSuccess) {
          alert('Invoice error TODO')
        } else {
          router.reload()
          return // No need to set isSubmitting to false
        }
      }
    } catch (e) {
      setVerificationStatus(false)

      if (e.message !== CardErrorCode.VerificationCancelledByUser) {
        setPaymentError({
          code: e.message as CardErrorCode,
        })
      }
      console.warn('payment.onSubmit error:', e)
    }

    setIsSubmitting(false)
  }

  const setVerificationStatus = (value: boolean) => {
    setIsVerifyingCard(value)
    isVerifyingRef.current = value
  }

  const changePaymentMethod = (paymentMethod: string) => {
    methods.reset()
    setSelectedPaymentMethod(paymentMethod)
  }

  const hasPaymentError = paymentError !== null
  const canRenderMainFlow = !invalidFlowSetup && !hasPaymentError

  const { errorTitle, errorMessage } = getErrorTitleAndMessage(
    invalidFlowSetup,
    paymentError,
  )

  const isPaid = paymentFlow?.paymentStatus === 'paid'
  const isInvoicePending = paymentFlow?.paymentStatus === 'invoice_pending'

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
                <Link href={paymentFlow.returnUrl ?? 'https://island.is'}>
                  <Button fluid>
                    {formatMessage(generic.buttonFinishAndReturn)}
                  </Button>
                </Link>
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
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
                  <PaymentSelector
                    availablePaymentMethods={
                      (paymentFlow?.availablePaymentMethods as any) ?? [
                        'card',
                        'invoice',
                      ]
                    }
                    selectedPayment={selectedPaymentMethod as any}
                    onSelectPayment={changePaymentMethod}
                  />
                  {selectedPaymentMethod === 'card' && <CardPayment />}
                  {selectedPaymentMethod === 'invoice' && (
                    <InvoicePayment
                      nationalId={paymentFlow?.payerNationalId}
                      reference={paymentFlow?.payerName}
                    />
                  )}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fluid
                    disabled={!methods.formState.isValid || isSubmitting}
                  >
                    {selectedPaymentMethod === 'card'
                      ? formatMessage(card.pay)
                      : formatMessage(invoice.create)}
                  </Button>
                  <Box display="flex" justifyContent="center">
                    <Link
                      href={paymentFlow.returnUrl ?? 'https://island.is'}
                      aria-disabled={isSubmitting}
                    >
                      <Button variant="text" disabled={isSubmitting}>
                        {formatMessage(generic.buttonCancel)}
                      </Button>
                    </Link>
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
                  onClick={() => setPaymentError(null)}
                >
                  {formatMessage(generic.back)}
                </Button>
              )}
            </Box>
          )
        }
      />

      <ThreeDSecure
        isActive={isVerifyingCard}
        onClose={() => {
          setVerificationStatus(false)
          setIsSubmitting(false)
        }}
        hasData={!!threeDSecureData}
        postUrl={threeDSecureData?.postUrl}
        scriptPath={threeDSecureData?.scriptPath}
        verificationFields={threeDSecureData?.verificationFields ?? []}
      />
    </>
  )
}
