import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { formatIsk } from '../../lib/utils'

export type Individual = {
  name: string
  nationalId: string
  phone: string
  email: string
}

type Payment = {
  chargeItemCode: string
  priceAmount: number
}

type FakeData = {
  allowFakeData: boolean
  fakePayments: Array<Payment>
}

type PaymentInfoProps = {
  field: {
    props: FakeData
  }
}

export const PaymentInfo: FC<
  React.PropsWithChildren<FieldBaseProps> & PaymentInfoProps
> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  // Get Payment Catalog
  const paymentCatalog = application.externalData?.paymentDistrictCommissioners
    ?.data as Array<Payment>

  // Get Charge Codes
  let birthCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY153',
  )
  let maritalCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY154',
  )

  const surveyCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY128',
  )

  const marriageConditionsCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY129',
  )

  // Fallback on fake data if on dev
  // TODO: remove once paymentcatalog is updated on dev to reflect prod
  if (field.props.allowFakeData) {
    birthCertCode = field?.props?.fakePayments?.find(
      (payment) => payment.chargeItemCode === 'AY153',
    )
    maritalCertCode = field?.props?.fakePayments?.find(
      (payment) => payment.chargeItemCode === 'AY154',
    )
  }

  // Isolate prices, calculate total and check if total is correct
  const prices = {
    birthCertificate: 2 * (birthCertCode?.priceAmount ?? 0),
    maritalCertificate: 2 * (maritalCertCode?.priceAmount ?? 0),
    marriageConditions: marriageConditionsCode?.priceAmount ?? 0,
    surveyCertificate: surveyCertCode?.priceAmount ?? 0,
  }

  // If correctTotal is false we only display final price
  // To avoid embarrassing mistakes on production if prices
  // descynchronize
  const correctTotal =
    prices.birthCertificate +
      prices.maritalCertificate +
      prices.surveyCertificate ===
    prices.marriageConditions

  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {formatMessage(m.payment)}
      </Text>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.maritalStatusCertificates)}</Text>
        <Text variant="h5">
          {correctTotal ? formatIsk(prices.maritalCertificate) : ''}
        </Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.birthCertificates)}</Text>
        <Text variant="h5">
          {correctTotal ? formatIsk(prices.birthCertificate) : ''}
        </Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.surveyCertificate)}</Text>
        <Text variant="h5">
          {correctTotal ? formatIsk(prices.surveyCertificate) : ''}
        </Text>
      </Box>
      <Divider />
      <Box display="flex" paddingTop={3} justifyContent="spaceBetween">
        <Text variant="h3" color="blue400">
          {formatMessage(m.total)}
        </Text>
        <Text variant="h3" color="blue400">
          {formatIsk(prices.marriageConditions)}
        </Text>
      </Box>
    </Box>
  )
}
