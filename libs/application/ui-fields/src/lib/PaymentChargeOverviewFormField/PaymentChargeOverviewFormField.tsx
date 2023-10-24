import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import {
  FieldBaseProps,
  PaymentChargeOverviewField,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { applicationUiFields as m } from '../../messages'

interface PaymentChargeOverviewFieldProps extends FieldBaseProps {
  field: PaymentChargeOverviewField
}

export const PaymentChargeOverviewFormField: FC<
  React.PropsWithChildren<PaymentChargeOverviewFieldProps>
> = ({ field, application }) => {
  const { externalData } = application
  const { formatMessage } = useLocale()

  const { chargeItemCode: code } = field

  const items = externalData.paymentCatalog.data as {
    priceAmount: number
    chargeItemCode: string
    chargeItemName: string
  }[]

  const item = items?.find(({ chargeItemCode }) => chargeItemCode === code)

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
