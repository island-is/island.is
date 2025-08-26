import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { formatIsk } from '../../lib/utils'
import { getValueViaPath } from '@island.is/application/core'

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
> = ({ application }) => {
  const { formatMessage } = useLocale()

  // Get Payment Catalog
  const paymentCatalog = application.externalData?.paymentDistrictCommissioners
    ?.data as Array<Payment>

  // Get Charge Codes
  const birthCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY171',
  )
  const maritalCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY172',
  )

  const surveyCertCode = paymentCatalog?.find(
    (payment) => payment.chargeItemCode === 'AY128',
  )

  const applicantHasBirthCertificate = getValueViaPath<boolean>(
    application.answers,
    'applicant.hasBirthCertificate',
  )
  const spouseHasBirthCertificate = getValueViaPath<boolean>(
    application.externalData,
    'birthCertificate.data.hasBirthCertificate',
  )

  const nrOfBirthCerts =
    (applicantHasBirthCertificate ? 1 : 0) + (spouseHasBirthCertificate ? 1 : 0)

  // Isolate prices, calculate total and check if total is correct
  const prices = {
    birthCertificate: nrOfBirthCerts * (birthCertCode?.priceAmount ?? 0),
    maritalCertificate: 2 * (maritalCertCode?.priceAmount ?? 0),
    surveyCertificate: surveyCertCode?.priceAmount ?? 0,
  }
  const totalPrice =
    prices.birthCertificate +
    prices.maritalCertificate +
    prices.surveyCertificate

  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {formatMessage(m.payment)}
      </Text>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.maritalStatusCertificates)}</Text>
        <Text variant="h5">{formatIsk(prices.maritalCertificate)}</Text>
      </Box>
      {nrOfBirthCerts > 0 && (
        <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
          <Text variant="h5">
            {formatMessage(m.birthCertificatesWithParameters, {
              nrOfBirthCerts: nrOfBirthCerts === 1 ? 'Eitt' : 'Tvö',
            })}
          </Text>
          <Text variant="h5">{formatIsk(prices.birthCertificate)}</Text>
        </Box>
      )}
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">{formatMessage(m.surveyCertificate)}</Text>
        <Text variant="h5">{formatIsk(prices.surveyCertificate)}</Text>
      </Box>
      <Divider />
      <Box display="flex" paddingTop={3} justifyContent="spaceBetween">
        <Text variant="h3" color="blue400">
          {formatMessage(m.total)}
        </Text>
        <Text variant="h3" color="blue400">
          {formatIsk(totalPrice)}
        </Text>
      </Box>
    </Box>
  )
}
