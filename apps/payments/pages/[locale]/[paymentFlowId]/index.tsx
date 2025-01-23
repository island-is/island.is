import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import gql from 'graphql-tag'
import { v4 as uuid } from 'uuid'

import {
  Query,
  QueryGetOrganizationByNationalIdArgs,
} from '@island.is/api/schema'
import { Box, Button, ModalBase } from '@island.is/island-ui/core'
import { Features } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'

import { PageCard } from '../../../components/PageCard/PageCard'
import initApollo from '../../../graphql/client'
import { PaymentHeader } from '../../../components/PaymentHeader/PaymentHeader'
import { PaymentSelector } from '../../../components/PaymentSelector/PaymentSelector'
import { CardPayment } from '../../../components/CardPayment/CardPayment'
import { InvoicePayment } from '../../../components/InvoicePayment/InvoicePayment'
import { ALLOWED_LOCALES, Locale } from '../../../utils'
import { getConfigcatClient } from '../../../clients/configcat'
import { card, generic, invoice } from '../../../messages'
import { ThreeDSecure } from '../../../components/ThreeDSecure/ThreeDSecure'
import { useRouter } from 'next/router'
import {
  getErrorTitleAndMessage,
  PaymentError,
} from '../../../utils/error/error'

import type {
  GetPaymentFlowDTO,
  VerifyCardInput,
  VerifyCardResponse,
  ChargeCardInput,
  ChargeCardResponse,
} from '@island.is/clients/payments'
import { getPaymentsApi } from '../../../services/payment'

interface PaymentPageProps {
  locale: string
  paymentFlowId: string
  paymentFlow: GetPaymentFlowDTO
  organization: Query['getOrganization']
  productInformation: {
    amount: number
    title: string
  }
  sessionCorrelationId: string
}

const GetOrganization = gql`
  query getOrganizationByNationalId($input: GetOrganizationByNationalIdInput!) {
    getOrganizationByNationalId(input: $input) {
      id
      title
      shortTitle
      logo {
        url
        title
      }
    }
  }
`

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
  let organization: PaymentPageProps['organization'] = null

  try {
    paymentFlow = await getPaymentsApi().paymentFlowControllerGetPaymentInfo({
      id: paymentFlowId,
    })

    if (!paymentFlow) {
      throw new Error('Payment flow not found')
    }

    const {
      data: { getOrganizationByNationalId },
    } = await client.query<Query, QueryGetOrganizationByNationalIdArgs>({
      query: GetOrganization,
      variables: {
        input: {
          nationalId: paymentFlow.organisationId,
        },
      },
    })

    organization = getOrganizationByNationalId
  } catch (e) {
    console.error(e)
  }

  const productInformation = {
    amount: paymentFlow?.productPrice ?? 0,
    title: paymentFlow?.productTitle ?? '',
  }

  return {
    props: {
      locale,
      paymentFlowId,
      // The generated client code transforms null to undefined which causes
      // serialisation issues when passing the object to the client
      paymentFlow:
        paymentFlow !== null
          ? (Object.fromEntries(
              Object.entries(paymentFlow).filter(
                ([_, value]) => value !== undefined,
              ),
            ) as any)
          : null, // TODO: Fix this in the generated client?
      organization,
      productInformation,
      sessionCorrelationId: uuid(),
    },
  }
}

export default function PaymentPage({
  paymentFlow,
  organization,
  productInformation,
  sessionCorrelationId,
}: PaymentPageProps) {
  const router = useRouter()
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  const { formatMessage } = useLocale()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentFlow?.availablePaymentMethods?.[0] ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingCard, setIsVerifyingCard] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [threeDSecureData, setThreeDSecureData] = useState(null)
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null)

  const invalidFlowSetup =
    !organization ||
    !productInformation ||
    !paymentFlow ||
    !paymentFlow.availablePaymentMethods

  const waitForCardVerification = async () => {
    const maximumWaitTimeSeconds = 60
    let remainingWaitTimeInMilliSeconds = maximumWaitTimeSeconds * 1000

    const interval = 5000

    while (remainingWaitTimeInMilliSeconds > 0) {
      const response = await fetch(
        `/greida/api/card/verificationStatus?paymentFlowId=${paymentFlow.id}`,
      )

      if (response.ok) {
        const result = await response.json()

        if (result.isVerified) {
          return true
        }
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
      remainingWaitTimeInMilliSeconds -= interval
    }

    return false
  }

  const verifyCard = async (
    data: Omit<VerifyCardInput, 'verificationCallbackUrl'>,
  ): Promise<VerifyCardResponse> => {
    const response = await fetch('/greida/api/card/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      // TODO: Present to user what went wrong
      const responseBody = await response.json()
      setPaymentError({
        code: responseBody.error,
      })
      throw new Error(responseBody.error)
    }

    return await response.json()
  }

  const chargeCard = async (
    data: ChargeCardInput,
  ): Promise<ChargeCardResponse> => {
    const response = await fetch('/greida/api/card/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      // TODO: Present to user what went wrong
      throw new Error(response.statusText)
    }

    return response.json()
  }

  const payWithCard = async (data: Record<string, unknown>) => {
    const { card, cardExpiry, cardCVC } = data

    // TODO Verify fields or let API?
    if (!card || cardExpiry || typeof cardExpiry !== 'string' || !cardCVC) {
      return
    }

    const [month, year] = cardExpiry.split('/')

    try {
      const cardInfo = {
        number: Number(card),
        expiryMonth: Number(month),
        expiryYear: Number(year),
        cvc: Number(cardCVC),
      }

      const verifyCardResponse = await verifyCard({
        amount: productInformation.amount,
        cardNumber: cardInfo.number,
        expiryMonth: cardInfo.expiryMonth,
        expiryYear: cardInfo.expiryYear,
        correlationId: sessionCorrelationId,
        paymentFlowId: paymentFlow.id,
      })

      setIsVerifyingCard(true)
      setThreeDSecureData(verifyCardResponse)

      const isCardVerified = await waitForCardVerification()

      if (!isCardVerified) {
        throw new Error('Card verification failed')
      }

      const chargeCardResponse = await chargeCard({
        amount: productInformation.amount,
        cardNumber: cardInfo.number,
        cvc: cardInfo.cvc,
        expiryMonth: cardInfo.expiryMonth,
        expiryYear: cardInfo.expiryYear,
        correlationId: sessionCorrelationId,
        paymentFlowId: paymentFlow.id,
      })

      if (chargeCardResponse.isSuccess) {
        router.push(`${router.asPath}/greitt`)
      }
    } catch (err) {
      // throw err
    }
  }

  const onSubmit: SubmitHandler<Record<string, unknown>> = async (data) => {
    setIsSubmitting(true)

    try {
      if (selectedPaymentMethod === 'card') {
        setIsProcessingPayment(true)
        await payWithCard(data)
      } else {
        router.push(`${router.asPath}/krafa-stofnud`)
        return
      }
    } catch (e) {
      setIsProcessingPayment(false)
      setIsVerifyingCard(false)
      console.warn('Error occured while submitting payment', e)
    }

    setIsSubmitting(false)
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
                    <Button variant="text">
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
      <ModalBase
        baseId="3ds"
        isVisible={isVerifyingCard}
        hideOnClickOutside={false}
      >
        <Box
          position="relative"
          width="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={[1, 8, 15]}
        >
          <Box
            borderRadius="large"
            overflow="hidden"
            background="white"
            width="half"
            padding={[1, 2, 3]}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              rowGap={2}
            >
              {threeDSecureData && (
                <ThreeDSecure
                  isActive={isVerifyingCard}
                  onClose={() => setIsVerifyingCard(false)}
                  postUrl={threeDSecureData.postUrl}
                  scriptPath={threeDSecureData.scriptPath}
                  verificationFields={threeDSecureData.verificationFields}
                />
              )}
            </Box>
          </Box>
        </Box>
      </ModalBase>
    </>
  )
}
