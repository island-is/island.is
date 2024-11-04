import { GetServerSideProps } from 'next'

import {
  Box,
  Button,
  Stack,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'

import { PageCard } from '../../components/PageCard/PageCard'

interface PaymentPageProps {
  locale: string
  paymentFlowId: string
  paymentFlow: any
}

export const getServerSideProps: GetServerSideProps<PaymentPageProps> = async (
  context,
) => {
  const { locale, paymentFlowId } = context.params as {
    locale: string
    paymentFlowId: string
  }

  const paymentFlow = await fetch(
    `http://localhost:3333/payments/${paymentFlowId}`,
  ).then((res) => res.json())

  return {
    props: {
      locale,
      paymentFlowId,
      paymentFlow,
    },
  }
}

export default function TestPage(props: PaymentPageProps) {
  return (
    <PageCard label={`Stofnun (${props.paymentFlow.organisationId})`}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Text variant="h1">{props.paymentFlow.productId} (id)</Text>
        <p>(todo fetch product info)</p>
      </Box>

      <Stack space={1}>
        <RadioButton id="yes" checked label="Kort" />
        <RadioButton id="yes" label="Krafa" />
      </Stack>
      <Button>Halda áfram</Button>
      <p>
        {props.locale} | {props.paymentFlowId}
      </p>
    </PageCard>
  )
  //   return <p>Test page (page router)</p>
}
