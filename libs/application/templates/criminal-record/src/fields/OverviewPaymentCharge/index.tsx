import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'

export const OverviewPaymentCharge: FC<FieldBaseProps> = ({ application }) => {
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
