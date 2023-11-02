import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { PropertyDetail } from '@island.is/api/schema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { m } from '../../lib/messages'

export const PaymentChargeOverview: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { externalData } = application
  const { formatMessage } = useLocale()

  const items = externalData.payment.data as {
    priceAmount: number
    chargeItemCode: string
    chargeItemName: string
  }[]

  const item = items?.find(
    ({ chargeItemCode }) =>
      chargeItemCode === ChargeItemCode.MORTGAGE_CERTIFICATE,
  )

  const { propertyDetails } = externalData.validateMortgageCertificate
    ?.data as {
    propertyDetails: PropertyDetail
  }

  return (
    <Box paddingTop="smallGutter">
      <Box
        borderRadius="standard"
        background={'blue100'}
        paddingX={2}
        paddingY={1}
        marginBottom={5}
      >
        <Text fontWeight="semiBold">
          {formatText(m.overviewPaymentCharge, application, formatMessage)}
        </Text>
        <Text>
          {propertyDetails?.propertyNumber}
          {' - '}
          {propertyDetails?.defaultAddress?.display}
        </Text>
      </Box>
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text marginTop="smallGutter">{item?.chargeItemName}</Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd" marginBottom="gutter">
            <Text>{item?.priceAmount?.toLocaleString('de-DE') + ' kr.'}</Text>
          </Box>
        </Column>
      </Columns>
      <Divider />
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginTop="gutter">
            <Text variant="h5">
              {formatText(m.overviewPaymentTotal, application, formatMessage)}
            </Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="h4" color="blue400">
              {item?.priceAmount?.toLocaleString('de-DE') + ' kr.'}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
