import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import gql from 'graphql-tag'

import {
  Query,
  QueryGetPaymentFlowArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'
import { Box, Button } from '@island.is/island-ui/core'
import { Features } from '@island.is/feature-flags'

import { PageCard } from '../../components/PageCard/PageCard'
import initApollo from '../../graphql/client'
import { PaymentHeader } from '../../components/PaymentHeader/PaymentHeader'
import { PaymentSelector } from '../../components/PaymentSelector/PaymentSelector'
import { CardPayment } from '../../components/CardPayment/CardPayment'
import { InvoicePayment } from '../../components/InvoicePayment/InvoicePayment'
import { ALLOWED_LOCALES, Locale } from '../../utils'
import { getConfigcatClient } from '../../clients/configcat'

interface PaymentPageProps {
  locale: string
  paymentFlowId: string
  paymentFlow: Query['getPaymentFlow']
  organization: Query['getOrganization']
  productInformation: {
    amount: number
    title: string
  }
}

const GetPaymentFlow = gql`
  query getPaymentFlow($input: GetPaymentFlowInput!) {
    getPaymentFlow(input: $input) {
      id
      productId
      invoiceId
      availablePaymentMethods
      organisationId
      metadata
    }
  }
`

const GetOrganization = gql`
  query getOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
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

  if (isFeatureEnabled) {
    return {
      notFound: true,
    }
  }

  const client = initApollo()

  let paymentFlow: any = null // TODO look into type "used before initialization"
  let organization: PaymentPageProps['organization'] = null

  try {
    const {
      data: { getPaymentFlow },
    } = await client.query<Query, QueryGetPaymentFlowArgs>({
      query: GetPaymentFlow,
      variables: {
        input: {
          id: paymentFlowId,
        },
      },
    })

    paymentFlow = getPaymentFlow

    const {
      data: { getOrganization },
    } = await client.query<Query, QueryGetOrganizationArgs>({
      query: GetOrganization,
      variables: {
        input: {
          slug: getPaymentFlow.organisationId,
        },
      },
    })

    organization = getOrganization
  } catch (e) {
    console.error(e)
  }

  // TODO fetch product information from TBR
  const productInformation = {
    amount: 133337,
    title: 'Titill vöru',
  }

  return {
    props: {
      locale,
      paymentFlowId,
      paymentFlow,
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
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentFlow?.availablePaymentMethods?.[0] ?? '',
  )

  const invalidFlowSetup =
    !organization ||
    !productInformation ||
    !paymentFlow ||
    !paymentFlow.availablePaymentMethods

  const onSubmit: SubmitHandler<Record<string, unknown>> = (data) => {
    console.log('Submit', data)
  }

  return (
    <PageCard
      headerSlot={
        !invalidFlowSetup ? (
          <PaymentHeader
            organizationTitle={organization?.title}
            organizationImageSrc={organization?.logo?.url}
            organizationImageAlt={organization?.logo?.title}
            amount={productInformation.amount}
            productTitle={productInformation.title}
          />
        ) : (
          <PaymentHeader organizationTitle="Villa" />
        )
      }
      bodySlot={
        !invalidFlowSetup ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" rowGap={2}>
                <PaymentSelector
                  availablePaymentMethods={['card', 'invoice']}
                  selectedPayment={selectedPaymentMethod as any}
                  onSelectPayment={setSelectedPaymentMethod}
                />
                {selectedPaymentMethod === 'card' && <CardPayment />}
                {selectedPaymentMethod === 'invoice' && <InvoicePayment />}
                <Button
                  type="submit"
                  fluid
                  disabled={!methods.formState.isValid}
                >
                  {selectedPaymentMethod === 'card' ? 'Greiða' : 'Stofna kröfu'}
                </Button>
                <Button colorScheme="white" fluid>
                  Hætta við
                </Button>
              </Box>
            </form>
          </FormProvider>
        ) : (
          <Box display="flex" flexDirection="column">
            <p>Ekki tókst að sækja upplýsingar um greiðsluflæði</p>
          </Box>
        )
      }
      headerColorScheme="primary"
    />
  )
}
