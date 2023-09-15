import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
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
    ({ chargeItemCode }) => chargeItemCode === ChargeItemCode.CRIMINAL_RECORD,
  )

  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">
              {formatText(m.overviewPaymentCharge, application, formatMessage)}
            </Text>
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
