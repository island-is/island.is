import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const PaymentCharge: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">
              {formatMessage(m.applicationCompleteTitle)}
            </Text>
            <Text marginTop="smallGutter">Rekstarleyfi</Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd" marginBottom="gutter">
            <Text>123 kr</Text>
          </Box>
        </Column>
      </Columns>
      <Divider />
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginTop="gutter">
            <Text variant="h5">
              {formatMessage(m.applicationCompleteTotal)}
            </Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="h4" color="blue400">
              123 kr
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
