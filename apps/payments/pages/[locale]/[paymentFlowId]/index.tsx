import { GetServerSideProps } from 'next'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { Box, Button } from '@island.is/island-ui/core'
import { Features } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'
import { findProblemInApolloError } from '@island.is/shared/problem'

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
  } = usePaymentOrchestration({
    paymentFlow,
    productInformation,
  })

  // Invoice payment doesn't have any input fields, so we don't need to check if it's valid
  const isCardPaymentInvalid =
    selectedPaymentMethod === 'card' && !methods.formState.isValid

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
              <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
                    loading={overallIsSubmitting}
                    fluid
                    disabled={overallIsSubmitting || isCardPaymentInvalid}
                  >
                    {selectedPaymentMethod === 'card'
                      ? formatMessage(card.pay)
                      : formatMessage(invoice.create)}
                  </Button>
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="text"
                      disabled={overallIsSubmitting}
                      onClick={() => {
                        if (!overallIsSubmitting) {
                          router.push(
                            paymentFlow.returnUrl ?? 'https://island.is',
                          )
                        }
                      }}
                    >
                      {formatMessage(generic.buttonCancel)}
                    </Button>
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
