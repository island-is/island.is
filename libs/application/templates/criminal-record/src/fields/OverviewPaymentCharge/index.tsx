import { Column, Columns, Divider, Link, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
// import * as styles from './descriptionWithLink.css'

type OverviewPaymentChargeProps = {
  field: {
    props: {
      chargeName: string
      chargePrice: string
    }
  }
}

export const OverviewPaymentCharge: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const item = externalData.payment.data as {
    priceAmount: number
    chargeItemName: string
  }
  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">Til greiðslu</Text>
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
            <Text variant="h5">Samtals</Text>
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
